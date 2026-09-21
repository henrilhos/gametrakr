# GameTrakr

A social platform for game enthusiasts to track, rate, and review the games they play, and follow other players' activity.

## Language

**Game entry**:
A registered user's record of a particular play experience or written review. It contains a dated or recurring play period, a review, or both, and may include a score and replay marker. A registered user may have multiple game entries for the same game.
_Avoid_: Game log, diary entry, activity

**Play period**:
The span represented by a game entry. A dated play period has an inclusive start date and an optional inclusive finish date; a recurring play period intentionally has no dates.
_Avoid_: Watched date, session

**Review**:
A written assessment contained in a game entry. A score is separate and does not make a game entry a review by itself.
_Avoid_: Rating, score

**Score**:
A registered user's current 1–10 evaluation of a game. A score may be set independently or through a game entry; the user's latest score is the one included in the community aggregate.
_Avoid_: Review, rating

**Played status**:
The user–game relationship recording that a registered user has played a game. Creating a game entry establishes played status, while removing an entry does not implicitly clear it.
_Avoid_: Game entry, playthrough

**Game details**:
The combined public representation of a game's descriptive facts and GameTrakr community data, including reviews and aggregate user score.
_Avoid_: IGDB game, database game

**Library**:
The collection of games a registered user has added to track as played, playing, or owned.
_Avoid_: Collection, catalog

**Wishlist**:
A registered user's list of games they intend to play or own in the future, kept separate from their library.
_Avoid_: Favorites

**Follow**:
A one-directional relationship where a registered user subscribes to another user's reviews and activity in their feed.
_Avoid_: Friend, subscribe

**Badge**:
An achievement awarded to a registered user for completing specific platform challenges.
_Avoid_: Achievement, trophy

**Recommendation**:
A game suggested to a registered user based on their genre, platform, and interest preferences.

**Registered user**:
A player who has created an account and can write reviews, follow others, and manage a library and wishlist.
_Avoid_: Member, account

**Public profile**:
The publicly visible representation of a registered user, including their identity details, reviews, follow relationships, and viewer-relative follow state.
_Avoid_: User record, account page

**Profile imagery**:
The pair of public images a registered user controls on their public profile: a square profile image and a wide cover image.
_Avoid_: Avatar, user media

**Visitor**:
An unauthenticated user who can browse public game pages and reviews but cannot write reviews, follow, or manage a library.
_Avoid_: Guest, anonymous user
