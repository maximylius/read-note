/**
 @IMPROVE & ADD FUNCTIONALITIES (0: last, 9: first)
3     sidepanel takes to long to expand.
6     reduce ammount of rerenders of notepanel
7     reduce ammount of rerenders of flowchart
6     issue notes can sometimes not be collapsed. happens with notes embed in other notes
6     when are and should notes be remounted?
6     on first load, some embeded notes are not loaded. for this reason they are not embeded. should update to also show those embeds
6     trigger note update before switching into that notebook
6     trigger note background update in mdPanel change
6     Improve dagre layout 
6     add flowchart for text comments 
6     think about where to embed annotation-notes. 
6     allow drag and drop of note into note
6     rework actions
6     add ability to create new notes within note
6     rework actions (including parts not in note section: load, delete, regExpHistory)
6     make login session stable
6     turn log-in register into pop up window
6     how to best structure server routes?
4     think about emoji implementation in note names.
5     allow quotes as links to sections to be expanded inside a non editable blockquote paragraph

@REMOVE BUGS  & NEW FEATURES------------------------
6     understand embeded blots in order to insert annotations.
6     implement connectedWith when @mention is used.
6     manage connections
6     think about way to have embeded blots represent flexible data
6     make login session more stable
4     2do: drag and drop annotation into note.
4 enable scrolling of sections.
4 fix url regexp
6 handle error: if text does not exist: do not open, remove from url, log message.

@MORE EFFICIENT CODE -------------------------
6     make mouse/click Handlers non-blocking
6     check whether multiple layers of mouse move / click
6     check amount of rerenders


@CLEANER CODE ---------------
6     reduce code repetition in actions

4 @pages  --------------------------------------
4    REMOVE second stage upload page.
4    landing page:
4         sign in only in navbar (those who once have looged in already know where to go).
4         welcome text diashow: speed read text, comfortable reading enviroment, manage texts notebooks & co.
4         which text do you want to read? paste link, upload pdf, insert manually (only text input), or search trough publically uploaded texts on THISWEBSITE
4         standard upload vs private /confidential upload, will only pop up after link, upload or pasted text in.
4         ask for text meta only after successfull upload.
4
4    user desk:
4          overview of notebooks and texts and annotations
4          3 panels: Overview panel, text panel with tabs and sections sidebar, notebooks panel with tabs.
4          expandable on focus. differentiated by colors/design.
4          text tabs & notebook tabs, can also have different colors
4          the link may change between each change of tabs.
4
1    user profile
1         tell others something about yourself, but remember to keep your private data private.
1         will show your statistics, reputation, profile pic, bio
1         connect with people: privacy status, allow access for contacts
1
1    About & Feedback page
1         pay with donations, not your data!
5         request new features. poll, collect donations.
1
4    Login / Register Page
4         implement as MODAL.
4         Show Display Name , "Already registered? Sign in!" / "Not yet registered? Sign up!" depending on url.
4

6 @SERVER improvements ----------------------------------
6    implement server clean up routines.
4    get anonymousSession token for not logged in users...
6    make get request not url only -> what if to many notes get requested? string to long...
6    request error handling
6    add  try & catch + async + await?
6    request error handling
6    set loading while requesting server data for individual components
4    include password and email validation
4

4 New Functionalities ----------------------------
3    note-mode: when no text is open allow more note windows.
6    turn annotations and notebooks into notes.  
6    give all notes title and attributes(links, hastags etc)  
6    create @mention and #keywords as Blots.
4    bush current focus element to react history
4    drag panel size with mouse. set min and max values.
4    add notes from texts to notebooksfuture: drag & drop. make it feel good...
4    speed reader
4    return to passage in text where you left off. add hgiglight / visual glow to help find the passage.
4    undo / redo buttons flashing / highlighting changed parts possible?
4    search within your text / comments
4    enable editing of section title
4    make selection begin after last whitespace before and end before first whitespace after.
4    enable modification of section range
4    make categories hierarchical & editable & save to server
1    Enable user to define and recommend category schemas
1    Enable user to drag position of categories to have better access
4    moderate markup for text with multiple section layers.
4    enable connection of sections
4    mind map creator before start reading text
4    scrape PDF & html, perserve formatting
4    Enable user to ask questions with text. Questions can be answered and or connected to other questions.
4    Formatting of annotations also? SO works because of nice formats. BUT keep it simple...
4    Ability to make general annotations to the text without refering to any passage? No.
0    encrypt private texts?
4    resize displayed text, button to hide left empty pane & give more space to text.
4    make text and notebook ids short for nice urls. OR make them include title.
4

2 Design -------------
2    what is ReachUI?
   get toasts & modals & tooltips
 npm install react-icons react-datepicker
 desing right click menu.
2    design with controller with svg
0    design category icons: citation: ,' argument ! question ? ~ # 3dCube, use colors
2    design mind map of sections: custom icons, shapes, (border-)color, dots on the right to indicate type and amount of attributes in section. 2 category levels, maximum 3.
2    scrollIntoView https://getbootstrap.com/docs/4.0/components/scrollspy/
6    design navbar
5    add loading spinners
1    display (warning) messages as toasts
1    change default color of selected text (blue) to fancy one
2    night mode. Color links, list items / headings differently?
2    original style format keep orignial font type
2    create CSS
2

2 @GIVE NAME
1     text note
1     note text
1     text overflow
1     connect text connector note
1     connect idea connect
1     link texts
1     text book
1     tagged
1     text-tags
1     texts and tags
1     text comfort
1     read station studio
1     zen reader taken by competitor
1     zen texts
1     text stream
1     text zone
1     Lesepult
1     one desk
1     top desk
1     slow reader
1     flow reader
1     faultier als logo
1     lazy spider
1     spider reader
1     Weberknecht
1
1

@icons
text: BsBook
collection: BsCollection
notebook: BsClipboard
annotation: BsBookmark BsBookmarks (has many variations)
note: BsFileText
idea: BsLightening
question: BsQuestion
comment: BsChatSquareDots
keywords: BsHash BsTag
quote / reference: BsBlockquoteLeft, BsChatSqaureQuote
assumption:
argument: BsExclamation
method:
result:
other / ... : BsThreeDots
importance:
upload:
triangle arrow: BsCaret
collapse: BsArrowsCollapse
expand: BsArrowsExpand
desk: BsLaptop BsLayoutSidebar
library:
screen resize: BsArrowsAngleContract BsArrowsAngleExpand BsArrowsFullscreen BsFullscreen
expand collapse sidepanel: BsChevronCompactLeft / Right / Up /Down

start: BsPlay BsPlayFill
Pause: BsPause BsPauseFill
stop: BsStop
skip: BsSkipBackward...

add: BsPlus
edit: BsPencil BsPencilSquare
delete: BsTrash BsX
minimize: BsDash
open:
search: BsSearch
drag: BsArrowsMove

undo: BsArrow90degLeft BsArrowCounterclockwise
redo: BsArrowReturnRight  BsArrowClockwise

spinner: BsArrowClockwise BsArrowRepeat

fonts: BsFonts
h123: BsTypeH1
bold: BsTypeBold
italic: BsTypeItalic
underlined: BsTypeUnderline
strike through: BsTypeStrikethrough
bullet list: BsListOl Ul Task/Check
check list: BsCardChecklist
link: BsLink
parapgraph
left mid right align: BsJustify
color
imarge: BsImage

Logout: BsPower
login:
register:

@Business model
ads & donations
pay for extra cloud memory / offline mode / encryption of content / no ads / adding extras that companies want - link to outlook / office?
donate or share to keep using: set positive mind set for user. how to verify whether it is shared? Do you need to? Possible data issues with backtracing? maybe: if that link is used once, then it is verified. what about social components: see friends notebooks?
free forever for private users.

@WEB SCRAPING LIBRARIES -----------------------------
     ...

mind map libraries
*
react-flow
     MIT license
     looks good.
     provides react interface to pass attributes and handlers
     mini map component helps keep overview
     new: created_at 07-2019
     do I need react-flow when i use dagre anyway?
         handles zoom, draging, conecting
         whats the usecase? creating own mindmaps? manipulating resources in that view? show preview of elements.
     does not include an arrangment alogrythm and pass resolving algorithm

http://cs.brown.edu/people/jcmace/d3/graph.html?id=small.json

dagre
     MIT license
     layout library: arranges elements
       handles positioning
       how is it positing the items?

d3
     license BSD-3 clause
     js library for interactive data visualization

react-flow-chart
      MIT license
      looks okay - but more like a tool for creating instead of using mind maps
     created_at 11-2018

@RICH TEXT EDITORS (ranked by github stars)
...
   
   I need flexibility for own embeds: flexible @Names, embeded notes

   
   Notes need to be able to be splitted at embeded contents

   if an update is done, then 

text editor needs to know which section belongs to which note. can possibly be achieved by wrapping it into a div with classname Notebook and id

Do i need quill?
   Delta? Not necessarily when
   Custom blots: yes.


   undo redo functionality can be achieved from redux possibly


...
switch to slate in the future?
...
Quill
   free to use BSD
   allows
     weird highliting
    ? pasting in formatted text and pictures highliting

trix
   free to use MIT
   allows
     weird highliting
     pasting in formatted text and pictures highliting

tinyMCE
   free to use GNU


what about the Blockstyle editor?

SOFTWARE TO IMPLEMENT -------------------------------
express-sanitizer or express-mongo-sanitize
express-validator

GENERAL MERN SETUP -------------------------------------
express webframework: handles routing
express-validator validate body data (email, pw)
mongose adds abstraction layer to read / edit data / allows creation of models
bcrypt encrypts passwords
jsonwebtoken encrypts meta data of session: e.g. logged in status -> is used to access protectes routes
config for global variables
Moment: formats dates
postman
nodemon: (DevDep) watches server script updates
concurrently: (DevDep) run backend + frontend with one command
redux: state management library
react-redux: allow redux & react to work together
redux-thunk: middleware for redux. allows for async function inside actions (wait for response & dispatch)
redux-devtools-extension: allows for cleaner way to enable extension

ENVIRONMNENT SET UP BEFORE REACT (MERN)
npm init -y initializes package.json
npm i express bcryptjs jsonwebtoken config
npm i -D nodemon concurrently

ENVIRONMENT SET UP:
npx create-react-app .
npm i moment react-moment Formats Dates
npm i redux react-redux redux-thunk redux-devtools-extension
react-router-dom missing?
npm i materialize-css
npm install --save bootstrap

set up react redux with json server:
npx create-react-app .
npm i -D json-server concurrently
npm i redux react-redux redux-thunk redux-devtools-extension

 */
