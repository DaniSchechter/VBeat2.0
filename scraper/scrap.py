#!/usr/bin/env python3
import requests
from logzero import logger # logging framework made easy

scraping_url = 'https://www.top100singles.net/2017/12/every-aria-top-100-single-in-2018.html'

def main():
	page_html = download_html(scraping_url)
	matching_lines = filter_lines(page_html)
	songs, artists = parse_songs(matching_lines)

	
	
def filter_lines(page_html):
	logger.info('filtering lines...')
	page_html_lines = page_html.split('\n')
	return [x for x in page_html_lines if 'var t' in x or 'var s' in x]

def parse_songs(matching_lines):
	logger.info('parsing songs')
	songs_line = [x for x in matching_lines if 'var s' in x]
	logger.info('found song line %s' % songs_line)
	artists_line = [x for x in matching_lines if 'var t' in x]
	logger.info('found artist line %s' % artists_line)
	return (None, None)

# a class representing a song
class Song():
	def __init__(self, title, artists, genre, release_date, song_url, album_image_url):
		self.title = title
		self.artists = artists
		self.genre = genre
		self.release_data = release_date
		self.song_url = song_url
		self.album_image_url = album_image_url
		logger.info('initialized Song=%s' % self)
	
	def save(self):
		logger.info('sending %s to db' % self)
	
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
