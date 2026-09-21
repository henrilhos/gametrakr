# Letterboxd log-entry semantics research

Research date: 2026-09-20

## Question

How does Letterboxd model watched status, diary entries, reviews, ratings, likes, and rewatches, and what should GameTrakr copy when defining a game log/review entry?

## Findings

### Watched status and diary logging are distinct

- Marking a film as watched means the member has seen it at some point; it does not require a viewing date. Logging records a particular viewing date, adds an entry to the Diary, and also marks the film watched if necessary. [Letterboxd FAQ](https://letterboxd.com/faq/#what-s-the-difference-between-marking-a-film-watched-and-logging-it)
- Letterboxd keeps the member-to-film watched relationship separately from log entries. Its API exposes a `watched` flag alongside lists of review IDs and diary-entry IDs. [Letterboxd API: `ProductionRelationship`](https://api-docs.letterboxd.com/#tag/Models/ProductionRelationship)
- Letterboxd requires diary entries, reviews, and the film-level rating to be removed before watched status can be toggled off. This supports treating “unwatch” as an explicit operation rather than an automatic consequence of deleting one entry. [Letterboxd FAQ](https://letterboxd.com/faq/#can-i-remove-a-film-from-my-watched-list)

### A log entry is one polymorphic record

- The official API defines a log entry as a diary entry when it has a date, a review when it has review text, or both when both conditions hold. A log entry therefore does not contain a separate required child Review record. [Letterboxd API: log entries](https://api-docs.letterboxd.com/#tag/Log-Entries)
- The entry owns optional diary details and optional review details, plus tags, a per-viewing rating, like state, creation/update timestamps, and privacy/comment policies. [Letterboxd API: `ProductionLogEntry`](https://api-docs.letterboxd.com/#tag/Models/ProductionLogEntry)
- A diary entry can contain no review, rating, or like: the date is sufficient to make it a valid log entry, while review, rating, and like are optional. Letterboxd also explicitly says ratings and likes may both be omitted. [Letterboxd API: `LogEntryCreationRequest`](https://api-docs.letterboxd.com/#tag/Models/LogEntryCreationRequest), [Letterboxd FAQ](https://letterboxd.com/faq/#what-s-the-difference-between-liking-and-rating-a-film)
- A rating alone is film activity but is not sufficient to create a log entry through the API; a log entry must have diary details or review text. [Letterboxd API: create log entry](https://api-docs.letterboxd.com/#tag/Log-Entries/operation/createLogEntry), [Letterboxd API: update messages](https://api-docs.letterboxd.com/#tag/Models/LogEntryUpdateMessage)

### Reviews may be coupled to a diary entry or stand alone

- A member can add review text later by editing an existing diary entry. The result remains the same entry, now satisfying both diary-entry and review criteria. [Letterboxd FAQ](https://letterboxd.com/faq/#can-i-log-a-film-and-review-it-later)
- A review can also exist without a watched date. Letterboxd's importer adds review text to a diary entry when `WatchedDate` is present and creates a review with no specified date when it is absent. [Letterboxd importing guide](https://letterboxd.com/about/importing-data/)
- Ratings belong to individual entries/viewings. Editing or adding a rating on one diary entry or review does not rewrite ratings on older entries, although the most recently entered rating becomes the member's current/default film rating. [Letterboxd FAQ](https://letterboxd.com/faq/#when-i-rate-a-film-do-all-my-ratings-for-it-change)

### Diary entries represent viewings and may repeat

- A diary entry represents an individual watch, so one member may create multiple entries for the same film. Letterboxd counts every watch in Diary totals while counting a film once in Films totals. [Letterboxd FAQ](https://letterboxd.com/faq/#why-does-my-films-total-differ-from-my-diary-entries-total)
- Rewatch is a property of the diary details for a particular dated entry, indicating that the member had seen the film before that viewing. It is not a property of review text. [Letterboxd API: `DiaryDetails`](https://api-docs.letterboxd.com/#tag/Models/DiaryDetails)
- The importer normally merges the same film and watched date into one diary entry, but Letterboxd explicitly permits legitimately separate same-date entries to be added manually. [Letterboxd importing guide](https://letterboxd.com/about/importing-data/#notes-on-importing)

### Editing and deletion operate on the entry and its facets

- An entry can be edited in place. The API permits independently changing or removing its diary details, review, tags, rating, and like state. Removing review text from a dated diary entry therefore preserves the diary facet of that entry. [Letterboxd API: `LogEntryUpdateRequest`](https://api-docs.letterboxd.com/#tag/Models/LogEntryUpdateRequest)
- An entry must continue to qualify as a diary entry or a review. Removing both diary details and review produces the documented `LogEntryWithNoReviewOrDiaryDetails` error; deleting the whole entry uses the separate delete operation. [Letterboxd API: `LogEntryUpdateMessage`](https://api-docs.letterboxd.com/#tag/Models/LogEntryUpdateMessage), [Letterboxd API: delete log entry](https://api-docs.letterboxd.com/#tag/Log-Entries/operation/deleteLogEntry)
- Letterboxd's help page says reviews can be edited or deleted and that edits replace the previous version; older revisions are not retained. Deleted content is recoverable only through the account export for a limited retention period, not through an undo operation. [Letterboxd FAQ](https://letterboxd.com/faq/#can-i-edit-or-delete-my-reviews-and-lists), [Letterboxd FAQ](https://letterboxd.com/faq/#i-deleted-a-review-or-list-can-i-retrieve-it)
- Letterboxd does not explicitly state in its public documentation whether deleting the last log entry automatically changes the separate watched flag. Its FAQ instead requires removing activity *before* explicitly unmarking a film watched, so the supported design inference is that deleting an entry should not itself perform “unwatch.” [Letterboxd FAQ](https://letterboxd.com/faq/#can-i-remove-a-film-from-my-watched-list)

## Implications for GameTrakr

Letterboxd supplies the aggregate and relationship semantics, but its single-day viewing date does not fit games that span days or recur indefinitely. GameTrakr therefore adopts the following game-native variation:

- Model a **Game entry** as the aggregate. An entry has a dated or recurring play period, written Review text, or both.
- Model a dated play period as an inclusive start date with an optional inclusive finish date. A missing finish means the playthrough is ongoing.
- Model a recurring play period explicitly with no dates. This represents games played indefinitely or intermittently without one meaningful start-to-finish span.
- Keep Review text/spoiler state, a 1–10 historical Score, and replay state as optional entry facets. Replay applies only to dated entries.
- Allow multiple dated entries per registered user and game, including overlapping and same-day periods, but at most one recurring entry per user/game.
- Treat “remove Review” as clearing the Review facet. Preserve the entry when it has a play period; delete a review-only entry that would otherwise become invalid.
- Keep Played status and the current Score as distinct per-user/game state. Entry creation establishes Played status, and an entry Score becomes the current Score, but deleting an entry does not silently clear either state.
- Keep the Game details module read-only. A separate deep Game entry module owns creation, editing, facet removal, deletion, and Played-status rules.

## Scope note

This research records Letterboxd's behavior as a product reference. It does not imply that GameTrakr must copy Letterboxd's five-star scale, single-day viewing model, film terminology, privacy tiers, tags, likes, or comments unless those capabilities are separately accepted into scope.
