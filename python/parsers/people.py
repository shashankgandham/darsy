from urllib.request import urlopen
from bs4 import BeautifulSoup
from wiki import wiki


class person:
    '''
        This class contains functions to get information about
        individual persons
    '''
    def __init__(self,person):
        '''
            Initializes the object by the html page
        '''
        self.url = wiki.get_url(person)
        self.page = BeautifulSoup(urlopen(self.url).read(), 'lxml')

    def birthdate(self):
        '''
            Gets the birthdate of the person
        '''
        date = self.page.find('span', {'class': 'bday'})
        if date:
            date = date.getText()
        return date

    def deathdate(self):
        '''
            Gets the deathdate of the person
        '''
        date = self.page.find('span', {'class': 'dday'})
        if date:
            date = date.getText()
        return date

    def birthplace(self):
        '''
            Gets the birthplace of the person
        '''
        place = self.page.find('span', {'class': 'birthplace'})
        if place:
            place = place.getText()
        return place

    def deathplace(self):
        '''
            Gets the birthplace of the person
        '''
        place = self.page.find('span', {'class': 'deathplace'})
        if place:
            place = place.getText()
        return place
