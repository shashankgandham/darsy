import MySQLdb as sql
from config import sqlconfig


class messages:

    def __init__():
        self.connection = sql.connect(
            host=sqlconfig.host, user=sqlconfig.user, passwd=sqlconfig.passwd
        )
        self.cursor = connection.cursor()

    def __del__():
        self.cursor.close()
        self.connection.close()

    def send_message(sender, recipient, message):
        self.cursor.execute(
            "INSERT INTO {}.outbox (message,recipient) VALUES({},{})".format(
                (sende, message, recipient)
            )
        )
        self.cursor.execute(
            "INSERT INTO {}.inbox (message,sender) VALUES({},{})".format(
                (recipient, message, sender)
            )
        )
        self.connection.commit()

    def recieve_message(recipient):
        query = "SELECT * FROM " + recipient + ".inbox"
        self.cursor.execute(query)
        messages = cursor.fetchall()
        connection.close()
        self.connection.commit()
