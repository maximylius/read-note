/**
@IMPROVE & ADD FUNCTIONALITIES (0: last, 9: first)

8    allow for connection of other types than just notes.
6    integrate new connected data structure: deleteNote: also delete its connections / it as reply / its replies(?).

@NOTE_PANEL
3     align add bubble for side notes. @SIDE_NOTE
5    reduce amount of rerenders for side notes when section attributes are changed. Probably due to useSelector listener for sections. maybe custom hook would solve this when configured that only changes in title, delta and creation / deletion are necessary to observe.
4    make non-user notes not editable? add button: suggest edit, this would then get suggested to the author. 
6     issue embeded notes can sometimes not be collapsed. happens with notes embed in other notes
6     when are and should notes be remounted?
6     trigger note update before switching into that notebook

@LOADING
6    implement lazy loading.
7     implement check, whether requested notes are loaded. If they arent load these notes. -> needs to be done for embeds and replies. And basically any note that is opened. 
6     on first load, some embeded notes are not loaded. for this reason they are not embeded. should update to also show those embeds


@SECTION_UI
4    enable editing of section title
2    UI: improve open / collapsed state of sections. they shall not autocollapse when another section is selected. In fact it should be better if they are open as long as there is enough space. Also open section attributes when section is just beeing created or there is enough space.
3     think about categories / dialoge
4     rethink color logic: for embeds and categories for sections.
3    connect sections to respective texts parts with polyone: left side mimic section height in text, right side mimcs section-item height. Top and bottom connect. Color: partly transparent mimicing the section color. Border? Maybe.
1    Enable user to define and recommend category schemas
2    design mind map of sections: custom icons, shapes, (border-)color, dots on the right to indicate type and amount of attributes in section. 2 category levels, maximum 3.


@QUILL
3     make quill stop jumping to bottom when loaded.

@OTHER_SIMPLE
3     sidepanel takes to long to expand. <- because expanding doesnt trigger a rerender. fix that!
2     rework actions (including parts not in note section: load, delete, regExpHistory) (partly done already)
3     add actions to noteinfo. 
3     if connection is removed in noteinfo than you could replace the delta-op with striketrough value 

@UI
2     improve quill text css.
1     100% width on footer.


@RAFAS_BRUDER
7    @MOBGODB   multiple document updates.
7    note_panel monster component. how to split?
6    do i need to seperate the logic out of the component? How?
6    how to best do performance checks?
6    how costly are server tasks?
6    how to best structure server routes?
6    is hording spareIds a good approach?
6    how to prevent frontend and mongodb to get out of sync?


7     reduce ammount of rerenders of flowchart

6     Improve dagre layout 
6     add flowchart for text comments

6     make login session stable
4     think about emoji implementation in note names.
5     allow quotes as links to sections to be expanded inside a non editable blockquote paragraph

4     #hastags for categories @ for notes only?
4     think about whether a differnce between linked and embeded notes shall be made (one doesnt expand, the other does always). 

@REMOVE BUGS  & NEW FEATURES------------------------
6     think about way to have embeded blots represent flexible data
6 handle error: if text does not exist: do not open, remove from url, log message.

@MORE EFFICIENT CODE -------------------------
6     make mouse/click Handlers non-blocking
6     check whether multiple layers of mouse move / click
6     check amount of rerenders


@CLEANER CODE ---------------
3     reduce code repetition in actions
4     make css files consistent (bootstrap, custom, use color vars)
1     reduce code repetition among components

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

4 @Future_Functionalities ----------------------------
9    work with iframe for webpages and or PDF Docs.
5    scroll to section when clicked
4    return to passage in text where you left off. add hgiglight / visual glow to help find the passage.
4    searchpanel: left side contains list with all results, flowchart in middle, and on the right possible preview of elements.
3    note-mode: allow more note windows at the same time.
4    drag panel size with mouse. set min and max values.
4    undo / redo buttons flashing / highlighting changed parts possible?
4    search within your text / comments
4    make selection begin after last whitespace before and end before first whitespace after.
4    enable modification of section range
4    make categories hierarchical & editable & save to server
4    moderate markup for text with multiple section layers.
4    mind map creator before start reading text
4    scrape PDF & html, perserve formatting OR use
4    resize displayed text
4    make text and notebook ids short for nice urls. OR make them include title.
4    DARK MODE - css theme.

2 Design -------------
2 desing right click menu.
2    design with controller with svg
0    design category icons: citation: ,' argument ! question ? ~ # 3dCube, use colors
5    add loading spinners

0 @FURTHER_IDEAS
1    Text-Logik-Visualisierung: Zoom-Level für Argumente -> Grob zu Feingliederung.
*/
