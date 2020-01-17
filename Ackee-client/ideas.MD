### MVP

- [x] Date range selector
- [x] Add oses graphs (pie charts - only by domain (no main))
  - [x] Date range selector
- [x] Add platform graphs (pie charts - only by domain (no main))
  - [x] Date range selector
- [x] Add Languages table (in lines like Original-Ackee)
  - [x] Date range selector
- [x] Add pages table (in lines like Original-Ackee)
  - [x] Routes selector (ex: kata -> sucess, fail)
  - [x] Date range selector
- [x] BUG - Date selector doesnt update numberOfDays in PagesOrLanguages
- [x] BUG - Backend always creates new tokens
- [x] Detailed durations graphs (Bubble 24hours)
  - [x] Scatter Graphs
  - [x] Date selector
  - [x] BUG - Chart show in 'test' instead of 'CodeWars'
- [x] BUG - Header scrollbar height

---

### Notes

- [x] Click on the name of a graphs to exchange position with the main one
- [x] Rewrite component by graphs style
  - [x] Rewrite graphs components to be dump
- [x] re-use token on login
- [x] FEATURE - Time visited (Created date of a Record)
  - [x] Add to Front-end (show a line? graph)
- [x] FEATURE - Add event to the Tracker
- [x] FEATURE - Show event in the Front-end
  - [x] BUG - Show hourglass
  - [ ] Add Date range selector
- [ ] FIX - Url dropdown in Pages
- [ ] BUG - Durations -> .toFixed(2)
- [ ] BUG - Views.Visited Times -> Main graph height
- [ ] Date range -> Input -> Put a debounce before calling the backend
- [ ] Durations:
  - [ ] Either reworked the average duration to be weighted, or show a multiple bars graphs

---

### Server

- [x] Views - Total -> Create a Unique total and Total total
- [x] Durations -> Send the arrays of domains IDs and let the server deal with forming a JSON
- [x] Durations - Detailed -> Group by dates instead of duration time
- [x] BUG - Languages All should return the domainId
- [x] BUG - Oses All shoudl return the domainId
- [x] BUG - Platforms All should return the domainId
- [x] Durations should send the number of viewers, to calculate a weighted average
