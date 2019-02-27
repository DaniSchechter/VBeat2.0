#!/usr/bin/env python3
import bson
import random
import pymongo
import requests
from logzero import logger # logging framework made easy
import logzero
import re
import json
import logging
import uuid

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
		s = fix_artists(s)
		song_dict_list.append(s.__dict__)
	save(mongoclient, song_dict_list) 

def get_random_username(artist):
	return artist + uuid.uuid4().__str__()	

artist_cache_list = []

def get_artist_object(artistname):
	global artist_cache_list
	artist_match_list = [x for x in artist_cache_list if x.display_name == artistname]
	if len(artist_match_list) == 1:
		logger.debug('used artist from cache')
		return artist_match_list[0].__dict__
	
	artist_object = Artist.create_from_name(artistname)	



	artist_cache_list.append(artist_object)
	return artist_object.__dict__['_id']
	

def fix_artists(song):
	artists = song.artists
	artists = artists.replace('{{', '').replace('}}', '')
	feat_split = artists.split('feat.')
	and_split = []
	for artist in feat_split:
		for split_res in artist.split('\\&'):
			and_split.append(split_res)
	
	comma_split = []
	for artist in and_split:
		for split_res in artist.split(','):
			comma_split.append(split_res)
		
	
	song.artists = [get_artist_object(a.strip()) for a in comma_split]
	return song
	

def save(mongoclient, song_dict_list):
	logger.info('saving songs to database')
	first_node = mongoclient['first-node']
	top_songs = first_node['songs']
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

class Artist():
	def __init__(self, username, password, display_name):
		self._id = bson.objectid.ObjectId()
		self.username = username
		self.password = password
		self.role = "ARTIST"
		self.profile_pic = 'https://i.kym-cdn.com/entries/icons/original/000/000/341/i-dunno-lol_1_.jpg'
		self.display_name = display_name
		self.email = username + '@artistmail.com'

	def create_from_name(name):
		username = get_random_username(name)
		password = 'random_artist_password'
		return Artist(username, password, name)

# a class representing a song
class Song():
	def __init__(self, title, artists, genre, release_date, song_url, album_image_url):
		self.name = title
		self.artists = artists
		self.genre = random.choice(['POP', 'JAZZ', 'HIP-HOP', 'ROCK', 'CLASSIC'])  
		self.release_date = release_date
		self.song_path = song_url
		images = ['https://www.thoughtco.com/thmb/oXOWMUKShSv3ym-a1xMVGPoabPM=/1200x800/filters:fill(auto,1)/archer_closeup-56a00f9f3df78cafda9fde1c.png','https://comedycentral.mtvnimages.com/images/tve/archer/tve_series_page/ARCHER_NextGen_Spotlight_NoLogo_1920x1080.jpg?width=640&height=360&crop=true', 'https://cdn.techadvisor.co.uk/cmsdata/features/3684524/archer_season_10_thumb800.jpg', 'https://tribzap2it.files.wordpress.com/2016/04/archer-season-7-ray-adam-reed.jpg?w=900', 'https://media.comicbook.com/2018/09/burt-reyonds-death-archer-fans-reaction-1132320-1280x0.jpeg']
		self.image_path = random.choice(images) # just because
		self.scraped = True
		self.num_of_times_liked = 0
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
