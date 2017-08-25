# Course Schedule Exporter
Generates an iCalendar file from your course schedule so that you can import anywhere such as Google Calendar, Outlook, Apple Calendar, etc.

Currently works for Quest(University of Waterloo) and Student Center(Cornell University), and it should work for any school that use PeopleSoft for managing their student profile (maybe with a little tweak).

# How to use:
- Log into your student information system (Quest, Student Center or some other names)
- Go to "Academics -> Enroll -> My Class Schedule", and select the desired term
- Make sure the display is in "List View". Copy the whole page by pressing Ctrl+A and then Ctrl+C
- Paste everything into the text field by pressing Ctrl+V
- **Select the correct date format**
- Click "Generate"
- Use the iCalendar file to import your schedule into any calendar software

# Notes:
There are already plenty of similar tools out there that do better job than mine (although I think some are over complicated and inefficient). I write this exporter to mainly get familiar with *RequireJS* and *iCalendar* file format. I reference from the following github repositories for my learning.
https://github.com/UWFlow/rmc
https://github.com/Trinovantes/Quest-Schedule-Exporter
