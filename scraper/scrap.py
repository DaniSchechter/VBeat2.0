#!/usr/bin/env python3
import pymongo
import requests
from logzero import logger # logging framework made easy
import logzero
import re
import json
import logging

# settings
scraping_url = 'https://www.top100singles.net/2017/12/every-aria-top-100-single-in-2018.html'
mongodb_string = 'mongodb+srv://alex:nE7fHawuXIMUmwlX@cluster0-k5m05.mongodb.net/first-node?retryWrites=true'

logzero.logfile('debug.log')

def main():
	page_html = download_html(scraping_url)
	matching_lines = filter_lines(page_html)
	songs = parse_songs(matching_lines)	
	#logger.debug(songs)
	mongoclient = open_mongo()
	song_dict_list = []
	for s in songs:
		song_dict_list.append(s.__dict__)
	save(mongoclient, song_dict_list)
	
	

def save(mongoclient, song_dict_list):
	logger.info('saving songs to database')
	first_node = mongoclient['first-node']
	top_songs = first_node['top-songs-scraped']
	mongo_object = top_songs.insert_many(song_dict_list)
	#logger.info('songs saved under id %s' % mongo_object.inserted_ids)
	logger.info('songs sent to db')

def filter_lines(page_html):
	logger.info('filtering lines...')
	page_html_lines = page_html.split('\n')
	return [x for x in page_html_lines if 'var t' in x or 'var s' in x]

def parse_songs(matching_lines):
	array_regex = re.compile('var \\w=\\[([^\\]]+)')
	logger.info('parsing songs')
	# find javascript array in html
	songs_line = [x for x in matching_lines if 'var s' in x]
	artists_line = [x for x in matching_lines if 'var t' in x]

	logger.debug('songs js array match len=%d, artists js array len=%d' % (len(songs_line), len(artists_line)))

	# observed values from html
	if len(songs_line) != 3 or len(artists_line) != 2:
		raise Exception("Parsing went wrong")
	
	songs_line = songs_line[0]
	artists_line = artists_line[0]

	logger.debug(songs_line)
	logger.debug(artists_line)

	song_array_inner_match = array_regex.match(songs_line)
	artists_array_inner_match = array_regex.match(artists_line)

	logger.debug('inner matches:')
	logger.debug(song_array_inner_match)
	logger.debug(artists_array_inner_match)

	song_array_inner_value = song_array_inner_match.group(1)	
	artist_array_inner_value = artists_array_inner_match.group(1)

	logger.debug('inner values:')
	logger.debug(song_array_inner_value)
	logger.debug(artist_array_inner_value)

	songs_split = song_array_inner_value.split('",')
	artists_split = artist_array_inner_value.split('",')

	logger.debug('lengths %d, %d' % (len(songs_split), len(artists_split)))

	songs_object = []
	for i in range(0,len(songs_split)):
		songs_object.append(Song(songs_split[i][1:], artists_split[i][1:], None, None, None, None))

	return songs_object 

def open_mongo():
	mongoclient = pymongo.MongoClient(mongodb_string)
	return mongoclient

# a class representing a song
class Song():
	def __init__(self, title, artists, genre, release_date, song_url, album_image_url):
		self.title = title
		self.artists = artists
		self.genre = genre
		self.release_data = release_date
		self.song_url = song_url
		self.album_image_url = album_image_url
		#logger.info('initialized Song=%s' % self)	
	
	def __str__(self):
		return str(self.__dict__)

# download html and basic check for status code
def download_html(url):
	logger.info('downloading %s' % url)
	r = requests.get(url)
	if r.status_code != 200:
		raise Exception('unable to request %s (code: %d)' % (url, r.status_code))
	
	return r.text


if __name__ == '__main__':
	main()	
