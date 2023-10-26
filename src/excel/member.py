from xltpl.writerx import BookWriter

writer = BookWriter('./template/member.xlsx')

class Member:
    def __init__(self, name, birthday, clubName, totalTraining):
        self.name = name
        self.birthday = birthday
        self.clubName = clubName
        self.totalTraining = totalTraining

data = {}
items = []

for i in range(0, 100):
    item = Member('name' + str(i), i, 'club' + str(i), i)
    items.append(item)

data['items'] = items
payloads = [data]

writer.render_book(payloads)
writer.save('result.xlsx')
