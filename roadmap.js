/**
@IMPROVE & ADD FUNCTIONALITIES (0: last, 9: first)
_TestTable_    TEXT    SECTION     NOTE
GET              0         0         0
PUT (INIT)       0         1         1 
PUT (UPDATE)     0         1         1 
DELETE           0         1         1 
DELETE (MANY)    0         0         1 
// register login success shall close modals.
9     resolce problems in common routes.
9     test if headers (for auth and getUserId) work
9     PUT / DELETE save res to user / project.
9     add projectIds to text, section & note // is it necessary to ingegrate it both ways?
@RECENT_BUGS : cant open two texts at once // when opening a note not always a tab item is created
// make url change close and open modals

@NOTE_PANEL
5    reduce amount of rerenders for side notes when section attributes are changed. Probably due to useSelector listener for sections. maybe custom hook would solve this when configured that only changes in title, delta and creation / deletion are necessary to observe.
2DAY- 6     issue embeded notes can sometimes not be collapsed. happens with notes embed in other notes
2DAY- 6     when are and should notes be remounted? // will this delete history? Can you transfer history // Can you duplicate the editor to allow editing from multiple places? // due to embeds this still would not be possible.
2DAY- 6     trigger note update before switching into that notebook
9     define object as function input => props = {state:{}, actions:{},input:{}} => pass props to next level and add new inputs to input.
{
  state: {},
  redux: {},
  actions: {}
  references: {},
  input: {}
}


@LOADING
2DAY- 6    implement lazy loading. @HIGH_PRIORITY
2DAY- 7     implement check, whether requested notes are loaded. If they arent load these notes. -> needs to be done for embeds and replies. And basically any note that is opened. 
2DAY- 6     on first load, some embeded notes are not loaded. for this reason they are not embeded. should update to also show those embeds


@SECTION_UI
2    UI: improve open / collapsed state of sections. they shall not autocollapse when another section is selected. In fact it should be better if they are open as long as there is enough space. Also open section attributes when section is just beeing created or there is enough space.
4     rethink color logic: for embeds and categories for sections.
3    connect sections to respective texts parts with polyone: left side mimic section height in text, right side mimcs section-item height. Top and bottom connect. Color: partly transparent mimicing the section color. 
1    Enable user to define and recommend category schemas
2    design mind map of sections: custom icons, shapes, (border-)color, dots on the right to indicate type and amount of attributes in section. 2 category levels, maximum 3.
2   shrink text size to fit into single line for section Title.
5   while not in flowchar view connect connected section with simple arc on the right hand side
6   set maximum height on section item - if exceeded 
5   when section flow chart is opened reuse flowcahrt-item-preview and close notepanel
6   improve scroll behaviour // alowing multiple scroll panes in side-panel
6   allow modes: structuring / note taking / standard (both = current)
6   display note title somewhere.



@QUILL
3     make quill stop jumping to bottom when loaded.
2DAY- 2     give focus (only) when new note is created.

@OTHER_SIMPLE
3     sidepanel takes to long to expand. <- because expanding doesnt trigger a rerender. fix that!
2     rework actions (including parts not in note section: load, delete, regExpHistory) (partly done already)

@UI
2DAY- 2     improve quill text css. Also make cursor more visible: hard to see if next to mention Blot.
1     100% width on footer.
3     design idea for hide reply btn: when hover it shall created a shadow above replies that are going to be hidden


@RAFAS_BRUDER
7    @MOBGODB   multiple document updates.
7    note_panel monster component. how to split?
6    do i need to seperate the logic out of the component? How?
6    how to best do performance checks?
6    how costly (moneywise) are server tasks?
6    how to best structure server routes?
6    is hording spareIds a good approach?
6    how to prevent frontend and mongodb to get out of sync?

// progressive web app.
// uuid: to prevent spareIds
// ATOMIC Design best practice
// Co-Developer finden: slack (react-berlin), meetup, indiehacker, bootstrappedFM

// ALLES was auf a verweis rausziehen und iterierieren
// updateMany <- gibt es. 
// nextJS -> kostenlos Content Delivery. Heroku nur für test. 

// smart - simple components
// NotePanelContainer - NotePanel
// styled components (angucken)
  
// Promise all


7     reduce ammount of rerenders of flowchart
6     Improve dagre layout 
6     add flowchart for text comments
6     make login session stable
4     #hastags for categories @ for notes only? 

@REMOVE BUGS  & NEW FEATURES------------------------
6     think about way to have embeded blots represent flexible data
6 handle error: if text does not exist: do not open, remove from url, log message.
3     weird focus note is open in side-panel and note-panel. performs update only on side-panel

@MORE EFFICIENT CODE -------------------------
6     make mouse/click Handlers non-blocking
6     check whether multiple layers of mouse move / click
6     check amount of rerenders
1     check what settimeout does and when it would be necessary to remeasure divs.


@CLEANER CODE ---------------
3     reduce code repetition in actions
4     make css files consistent (bootstrap, custom, use color vars)
1     reduce code repetition among components


6 @SERVER improvements ----------------------------------
9    mongodb error check: .toString(). does indexOf always work?
8    make sure to send one response per request. 
8    if a link to deleted document is in any note, then all these notes have to be updated: replacing mention blot with deleted-blot. in both: frontend and server side? 
6    implement server clean up routines.
4    get anonymousSession token for not logged in users... route: migrate session to user.
6    make get request not url only -> what if to many notes get requested? string to long...
6    request error handling
6    set loading while requesting server data for individual components
4    include password and email validation
4    do i need to JSON.stringify axios requests?

4 @Future_Functionalities ----------------------------
9    work with iframe for webpages and or PDF Docs.
5    scroll to section when clicked
4    return to passage in text where you left off. add hgiglight / visual glow to help find the passage.
4    searchpanel: left side contains list with all results, flowchart in middle, and on the right possible preview of elements.
3    when note{isAnnotation} is opened it should be opened within section, not notepanel - if the text is already open.
3    note-mode: allow more note windows at the same time.
4    drag panel size with mouse. set min and max values.
4    undo / redo buttons flashing / highlighting changed parts possible?
4    search within your text / comments
4    make selection begin after last whitespace before and end before first whitespace after.
5    allow quotes as links to sections to be expanded inside a non editable blockquote paragraph
4    think about whether a differnce between linked and embeded notes shall be made (one doesnt expand, the other does always).
4    enable modification of section range
4    make categories hierarchical & editable & save to server
4    make non-user notes not editable? add button: suggest edit, this would then get suggested to the author. 
4    moderate markup for text with multiple section layers.
4    mind map creator before start reading text
4    scrape PDF & html, perserve formatting OR use
4    resize displayed text
4    make text and notebook ids short for nice urls. OR make them include title.
4    think about emoji implementation in note names.
4    DARK MODE - css theme.
4    Soft delete: add delete flag to documents to enable restore.
4    Creted dialogue when deleting: "Are you sure?" "Do you want to delete all annotations you have made within this text / section?"
6    URL should represent session - somehow. It maybe have a session token - and a state id: if you request this token from server you get the contents. if you are entitled to.
// suggest note tipps to format notes  // enforce structure of e.g. question
// enable sectionless view with all comments.
// intuitive Design
// add PROJECT DATA TYPE
// add GROUP DATA TYPE 
// add naviagation hierachy when creating @mention_connections (e.g. project-text-section-note / project-note)
// make menu allowing to select what to do with embed: open inside other note, open at text-section, open in notepanel

2 Design -------------
2 desing right click menu.
2    design with controller with svg
0    design category icons: citation: ,' argument ! question ? ~ # 3dCube, use colors
5    add loading spinners

0 @FURTHER_IDEAS
1    Text-Logik-Visualisierung: Zoom-Level für Argumente -> Grob zu Feingliederung.


4 @pages  --------------------------------------
4    REMOVE second stage upload page.
4    landing page:
4         sign in only in navbar (those who once have looged in already know where to go).
4         welcome text diashow: speed read text, comfortable reading enviroment, manage texts notebooks & co.
4         which text do you want to read? paste link, upload pdf, insert manually (only text input), or search trough publically uploaded texts on THISWEBSITE
4         standard upload vs private /confidential upload, will only pop up after link, upload or pasted text in.

4    user desk:

1    user profile
1         tell others something about yourself, but remember to keep your private data private.
1         will show your statistics, reputation, profile pic, bio
1         connect with people: privacy status, allow access for contacts
1
1
*/
