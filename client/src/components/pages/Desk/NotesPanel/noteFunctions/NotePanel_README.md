# NotePanel README

Explaning the logic of the component to facilitate future updates of it.

How does the logic of the Handlerfunction based on:

1. DOM EventListeners
2. Quill EventListeners
3. State updates
4. UseEffect calls
5. Remount events? Might delete history.

come together?

## 1. DOM EventListeners

- click: clickHandler calls different handlerfunctions depending on e.target

  - mentionCharClickHandler
    - calls different load functions depending on the resType
      - To-Do check whether all load-routes exist
      - handle case if res is not accessible (dont open anything, dispatch alert)
  - navlineClickHandler
    - closes embed
    - looks through deltas to find open and close embed and then slices them out
  - mentionSpanClickHandler

    - if resType !== note dispatch res load functions
    - can it be devided into a closing and an opening handler by looking at e.target.data-id if isOpen=false?
      - can you copy a thing yes but only one would be open. if you then click on not open one it would close both instances.
    - if notes is not loaded, then load it before processeding. 2do: make this process non-blocking.
    - note gets updated eventhough everything is the same

  - @To-Do move inform parent about change into handlers
    - @BUG: Selection does not always seem up to date: when mentionspan is clicked selection is still null.

- click: setCursorToQuillEnd
  - if clicked inside container but outside of quill-editor selection is set to the end
- focusin & focusout: toggleFocusClass
  - toggle className 'active-editor' to container when fousin/out

## 2. Quill EventListeners

- onChange: when quill content is changed
  - calls deltaInconsistencyCheck
    - checks whether delta is inconsistent by checking
      - if each started embed-seperator begin is closed correctly and that its preceding op was the @mention op
      - if each embed-seperator end was opened correctly
  - if inconsistent undo change and dispatch alert
  - if consistent setChangedEditorCounter+1 which will start useEffect change timeout
- onChangeSelection: when selection enters / leaves / changes
  - also runs when component is mounting and at each userinput.
  - checks whether add-bubble should be displayed
    - @BUG: add bubble is not shown after linebreak is entered, only when linebreak is specifically targeted
  - checks whether selection is at embed-seperator and therefore needs to be bounced of and decides whether shall be bounced off in front or after seperator. @To-Do does not yet when range is selected, whether range-end needs to be pushed away.

## 3. State Updates

## 4. UseEffect calls

- [changedEditorCounter]: preliminary handle editor change:
  - if less than 1 change is registered, dont execute (to prevent from running at mount).
  - Set 5 second timeout to call handleEditorChange.
  - if dismounting timeout is cleared so that latest timeout will prevail.
- [once]: At DisMount call handleEditorChange
- [once]: Adding Eventlisteners. (see above)
- [once]:(deactived) accessing quill-history
  - trying to delete the first element of history (when editor was empty while mounting) to prevent undo actions from accidentally deleting all contents.
- [texts, sections, notes]: updates at values which update the mention module to allow links to new docs / disallow to deleted docs

## Helper functions

- deltaInconsistencyCheck
- handleEditorChange
  - what does it do?

## Common Operations

- look through delta.ops to find op at range.index or within range.index + range.length.
  - but look up and continue criterias are different only while is common

```
some() {code}
```
