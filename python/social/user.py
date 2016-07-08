import MySQLdb as sql
from config import sqlconfig


class users:

    def __init__():
        self.connection = sql.connect(
            host=sqlconfig.host, user=sqlconfig.user, passwd=sqlconfig.passwd
        )
        self.cursor = self.connection.cursor()

    def __del__():
        self.cursor.close()
        self.connection.close()

    def new_user(name, email):
        self.cursor.execute(
            "SELECT ID FROM dutchman.Users WHERE Email=%s",
            [email]
        )
        existing_user = self.cursor.fetchall()
        if len(existing_user) is not 0:
            print("Existing User")
            return
        self.cursor.execute(
            "INSERT INTO dutchman.Users(Name,Email) VALUES(%s,%s)",
            (name, email)
        )
        self.connection.commit()
        self.cursor.execute(
            "SELECT ID FROM dutchman.Users WHERE Email=%s",
            [email]
        )
        ID = self.cursor.fetchall()
        ID = ID[0][0]
        command = "CREATE TABLE " + email
        query = ("CREATE DATABASE " + email,)
        query.append(
            command + ".inbox (ID INT NOT NULL AUTO_INCREMENT, \
            message VARCHAR(2000) NOT NULL, recipient VARCHAR(200), \
            read INT NOT NULL)"
        )
        query.append(
            command + ".outbox (ID INT NOT NULL AUTO_INCREMENT, \
            message VARCHAR(2000) NOT NULL, \
            sender VARCHAR(200), \
            read INT NOT NULL))"
        )
        query.append(
            command + ".queries (ID INT NOT NULL AUTO_INCREMENT, \
            message VARCHAR(2000) NOT NULL, \
            response VARCHAR(2000))"
        )
        query.append(
            command + ".friends (SR INT NOT NULL AUTO_INCREMENT, \
            ID INT NOT NULL)"
        )
        self.cursor.executemany(query)
        self.cursor.close()
        self.connection.close()

    def add_friend(user, friend):
        self.cursor.execute(
            "INSERT INTO " + user + ".friend (ID) VALUES(%s)", [friend]
        )
        self.connection.commit()
