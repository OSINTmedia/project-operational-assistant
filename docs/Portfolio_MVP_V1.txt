# Product Design Freeze v1 — Portfolio MVP

## 1. პროდუქტის სახელი / სამუშაო აღწერა

**Project Operational Assistant**

ქართულად:

**პროექტის ოპერაციული ასისტენტი**

პროდუქტი არის მარტივი ვებ-აპლიკაცია მცირე და საშუალო project-based გუნდებისთვის, რომელიც ეხმარება მენეჯერებს, პროექტის მენეჯერებს და მომხმარებლებს დაინახონ მიმდინარე Issue-ები, მათი სტატუსები, მფლობელები, კურატორები, პრიორიტეტები, dependency-ები და პროგრესი.

პროდუქტის მიზანი არ არის კიდევ ერთი task manager-ის შექმნა. მისი მიზანია operational clarity: ვინ რას აკეთებს, ვის მხარესაა შემდეგი მოქმედება, რა არის დაბლოკილი, რა არის დაგვიანებული და რა საჭიროებს განახლებას.

---

## 2. პროდუქტის მთავარი მიზანი

პროდუქტმა უნდა აჩვენოს:

* მრავალ პროექტში მიმდინარე Issue-ები
* ინდივიდუალური და ჯგუფური სამუშაოები
* სტატუსები და პრიორიტეტები
* Owner და Curator
* dependency-ები
* progress და მდგომარეობები
* საჭიროებს თუ არა Issue განახლებას
* რა არის blocked, delayed, waiting ან done
* ვინ შეცვალა ბოლო მდგომარეობა და როდის

Portfolio MVP-ის მიზანია დამსაქმებელს ან პოტენციურ დამკვეთს აჩვენოს:

* product thinking
* systems thinking
* workflow modeling
* structured data design
* dashboard thinking
* UX discipline
* MVP scope control
* future expansion readiness

---

## 3. პროდუქტი არ არის

ეს პროდუქტი არ არის:

* Jira clone
* Asana clone
* Trello clone
* generic todo app
* CRM
* IT helpdesk
* employee monitoring tool
* full enterprise workflow platform
* AI-first assistant
* notification platform
* document management system

---

## 4. მომხმარებლის როლები

Portfolio MVP-ში გამოიყენება სამი როლი:

### Manager

ხედავს საერთო მდგომარეობას, პროგრესს, მეტრიკებს, დაბლოკილ და დაგვიანებულ Issue-ებს.

Manager-ის მიზანია operational visibility, არა თანამშრომლების კონტროლი.

### Project Manager

მთავარი მომხმარებელი.

ქმნის პროექტებს, Issue-ებს, ანიჭებს სტატუსებს, პრიორიტეტებს, თეგებს, Owner-ს, Curator-ს და აკვირდება პროექტის operational მდგომარეობას.

### User

მუშაობს მისთვის მინიჭებულ Issue-ებზე, ცვლის სტატუსს, ანახლებს მდგომარეობას და საჭიროების შემთხვევაში ownership-ს გადასცემს სხვას.

---

## 5. მთავარი ერთეული — Issue

Issue არის ოპერაციული სამუშაო ერთეული.

Issue შეიძლება იყოს დავალება, საკითხი, პრობლემა, dependency, მოლოდინი, blocker ან გადასაბარებელი ქმედება.

Issue არ არის თავისუფალი კომენტარების სივრცე. მისი ძირითადი მნიშვნელობა უნდა იმართებოდეს structured fields-ით.

---

## 6. Issue-ის ძირითადი ველები

Portfolio MVP-ში Issue-ს აქვს:

* Title
* Description
* Project
* Type
* Status
* Priority
* Tags
* Labels
* Owner
* Curator
* Dependency
* Created by
* Created at
* Updated by / Modified by
* Updated at / Modified at
* Activity history

---

## 7. Open Text Policy

Open text დაშვებულია მხოლოდ:

* Title
* Description

დანარჩენი ძირითადი ოპერაციული მნიშვნელობები უნდა იყოს structured:

* Status
* Priority
* Type
* Tag
* Label
* Owner
* Curator
* Dependency
* Project
* Team

მიზანი არის open-text ქაოსის შემცირება.

---

## 8. Issue Type

Portfolio MVP-ში Issue შეიძლება იყოს:

### Individual Issue

ინდივიდუალური Issue, რომელიც ეკუთვნის ერთ Owner-ს.

Owner თვითონ აახლებს სტატუსს, ცვლის პრიორიტეტს და საჭიროების შემთხვევაში ხურავს Issue-ს.

### Group Issue

ჯგუფური Issue, რომელსაც ჰყავს:

* Curator
* Owner
* მონაწილე წევრები
* dependency საჭიროების შემთხვევაში

Group Issue-ში Curator არ არის ავტომატურად Owner.

Curator ინარჩუნებს კონტექსტს და აკონტროლებს, რომ საკითხი არ დაიკარგოს.

Owner არის ის, ვის მხარესაც ამ მომენტში დგას შემდეგი მოქმედება.

---

## 9. Ownership Model

Issue-ს თავდაპირველი Owner არის შემქმნელი.

Owner-ის გადაბარება შესაძლებელია.

ყველა ღია Issue-ზე უნდა ჩანდეს:

**ვის მხარესაა შემდეგი მოქმედება.**

ეს არის პროდუქტის ერთ-ერთი მთავარი წესი.

---

## 10. Curator Model

Curator გამოიყენება განსაკუთრებით Group Issue-ზე.

Curator-ის მიზანია:

* საკითხის კონტექსტის შენარჩუნება
* წევრებს შორის სიცხადის დაცვა
* პასუხისმგებელი მხარის გამოკვეთა
* სტატუსის უყურადღებოდ არ დატოვება
* პროექტის მენეჯერისთვის operational clarity-ის შენარჩუნება

Curator არ ნიშნავს უფროსს, შემსრულებელს ან დამსჯელ მხარეს.

---

## 11. Statuses

Demo/default statuses:

* New
* Planned
* Waiting
* Blocked
* Delayed
* In Progress
* Done
* Canceled

Custom statuses დაშვებულია მხოლოდ Manager-ის ან Project Manager-ის მიერ.

Regular User-ს არ შეუძლია ახალი status-ის შექმნა.

ეს იცავს სისტემას status ქაოსისგან.

---

## 12. Needs Update

Needs Update არ არის ჩვეულებრივი status.

Needs Update არის system label / attention signal.

ის ნიშნავს:

**Issue-ის ბოლო მდგომარეობა აღარ არის საკმარისად ახალი ან სანდო და საჭიროებს განახლებას.**

Needs Update არ ნიშნავს, რომ სამუშაო არ შესრულდა.

---

## 13. Priority

Priority არის structured:

* Low
* Medium
* High
* Critical

Priority არ უნდა გადაიქცეს რთულ scoring ან risk model-ად.

---

## 14. Tags

Tags არის სწრაფი კლასიფიკაციის მექანიზმი.

Tags უნდა იყოს:

* autocomplete-first
* სწრაფი
* მარტივად გამოსაყენებელი
* duplicate-prevention-friendly
* reusable

ყველა მომხმარებელს შეუძლია tag-ის გამოყენება.

ახალი tag-ის შექმნა შესაძლებელია, მაგრამ სისტემა პირველ რიგში უნდა სთავაზობდეს უკვე არსებულ tag-ებს, რათა არ შეიქმნას დუბლიკატები და ქაოსი.

Tags-ის მაგალითები:

* Field
* Statistics
* Client
* Questionnaire
* Review
* Data Update
* Internal
* Urgent
* Follow-up
* Research

---

## 15. Labels

Labels გამოიყენება დაზუსტებისთვის და context marking-ისთვის.

Labels არ უნდა ჩაანაცვლოს Status.

Status აჩვენებს Issue-ის სამუშაო მდგომარეობას.

Label აძლევს დამატებით კონტექსტს.

---

## 16. Dependency

Issue შეიძლება დამოკიდებული იყოს:

* სხვა User-ზე
* სხვა Project Manager-ზე
* Team-ზე
* კლიენტის შიდა წარმომადგენელზე
* გარე კონტრაქტორის შიდა წარმომადგენელზე
* უცნობ / დასაზუსტებელ მხარეზე

კლიენტი და გარე კონტრაქტორი არ არიან სისტემის მომხმარებლები.

მათთან დაკავშირებული სტატუსი მართავს კომპანიის შიდა წარმომადგენელი.

მაგალითად:

* “ველოდები კითხვარს კლიენტისგან”
* “ველოდები ფაილს კონტრაქტორისგან”
* “გარე მხარისგან პასუხი არ მოსულა”

---

## 17. Activity History

Portfolio MVP-ში უნდა იყოს მარტივი activity history.

საკმარისია დაფიქსირდეს ძირითადი ცვლილებები:

* status changed
* owner changed
* priority changed
* tag added / removed
* curator changed
* issue updated

ყოველ activity entry-ზე ჩანს:

* რა შეიცვალა
* ვინ შეცვალა
* როდის შეიცვალა

სრული enterprise audit trail არ შედის MVP-ში.

---

## 18. Attachments

Attachments არ შედის Portfolio MVP-ში.

Attachments გადადის Future scope-ში.

ამის მიზეზი:

* ამატებს storage complexity-ს
* ზრდის permission მოთხოვნებს
* ქმნის file handling პრობლემებს
* აშორებს პროდუქტს core operational clarity-სგან

Portfolio MVP-ში საკმარისია Description-ში ან Source Reference-ში კონტექსტის მითითება.

---

## 19. მთავარი Navigation / Tabs

Portfolio MVP-ში არის ოთხი ძირითადი სივრცე:

### Personal

აჩვენებს მომხმარებელთან დაკავშირებულ Issue-ებს:

* assigned to me
* created by me
* curated by me
* needs update
* blocked / delayed items related to me

### Projects

აჩვენებს პროექტებს და პროექტებში არსებულ Issue-ებს.

აქ ჩანს:

* project list
* project details
* issues by project
* status distribution
* owner / curator / priority / tag filtering

### Team Workspace

მსუბუქი team-level სივრცე.

აჩვენებს კონკრეტული გუნდის საერთო Issue-ებს, წევრებს და team progress-ს.

Team Workspace არ უნდა გადაიქცეს რთულ permission ან organization-management სისტემად.

### Dashboard

აჩვენებს საერთო operational მდგომარეობას.

Dashboard განსაკუთრებით სასარგებლოა Manager-ისთვის და Project Manager-ისთვის.

---

## 20. Organization Tab

Organization tab არ შედის Portfolio MVP-ში.

ის გადადის Expansion Roadmap-ში.

მიზეზი:

* ზრდის scope-ს
* საჭიროებს უფრო რთულ permissions-ს
* აჩენს hierarchy/configuration პრობლემებს
* არ არის საჭირო core hypothesis-ის დასამტკიცებლად

---

## 21. Dashboard

Dashboard უნდა იყოს საკმარისად ვიზუალური portfolio demo-სთვის, მაგრამ არ უნდა გახდეს heavy analytics system.

Dashboard-ში შედის:

* total issues
* open issues
* done issues
* waiting issues
* blocked issues
* delayed issues
* needs update issues
* issues by project
* issues by status
* issues by priority
* issues by owner
* personal progress
* team progress
* project progress

Dashboard შეიძლება შეიცავდეს:

* metric cards
* simple charts
* filters

Dashboard-ის მიზანი არის operational visibility, არა employee scoring.

---

## 22. Demo Mode

Portfolio MVP-ს უნდა ჰქონდეს online demo GitHub/portfolio მიზნისთვის.

Demo-სთვის საჭიროა:

* seed data
* demo projects
* demo users
* demo issues
* demo statuses
* demo tags
* reset demo data option
* მომხმარებლის მიერ ტესტური Issue-ის შექმნის შესაძლებლობა
* დროებითი მონაცემების შენახვის შესაძლებლობა ტესტირებისას

Demo-ს მიზანია, visitor-მა შეძლოს პროდუქტის რეალურად გამოცდა და არა მხოლოდ screenshot-ების ნახვა.

---

## 23. Notifications

Full notification system არ შედის Portfolio MVP-ში.

Portfolio MVP-ში საკმარისია in-app attention signals:

* Needs Update
* Assigned to Me
* Blocked
* Delayed
* Waiting
* Curated by Me

Browser Push, Email, Outlook, Telegram, WhatsApp, Slack და სხვა connectors რჩება Future scope-ში.

პროდუქტი უნდა იყოს future-feature-ready მსგავსი გაფართოებებისთვის, მაგრამ ისინი არ შედის MVP-ში.

---

## 24. Feature Inventory

### Must Have

* User roles: Manager, Project Manager, User
* Projects
* Issues
* Individual Issue
* Group Issue
* Owner
* Ownership transfer
* Curator
* Status
* Priority
* Tags
* Labels
* Dependency
* Created by / Created at
* Updated by / Updated at
* Basic activity history
* Personal tab
* Projects tab
* Team Workspace tab
* Dashboard
* Needs Update as system label
* Filtering by project, status, priority, owner, tag
* Demo data
* Reset demo data
* Simple charts / metrics

### Should Have

* Tag autocomplete
* Duplicate tag prevention
* Status management by Manager / Project Manager
* Dashboard filters
* Team progress summary
* Project progress summary
* “Curated by me” view
* “Needs Update” view
* Simple source/reference field
* Basic search

### Nice to Have

* Saved filters
* Color-coded statuses
* Lightweight issue templates
* Recent activity panel
* Quick action buttons
* Basic onboarding text
* Demo guide / sample workflow

### Future

* Attachments
* Comments
* Browser push notifications
* Email notifications
* Outlook integration
* Telegram integration
* WhatsApp integration
* Slack integration
* Calendar integration
* AI-assisted tag/status suggestions
* AI-assisted issue summaries
* Organization workspace
* Advanced permissions
* Advanced analytics
* Custom workflow builder
* External guest access
* Full audit trail

### Remove / Not for MVP

* Client accounts
* Contractor accounts
* Employee performance scoring
* Surveillance dashboard
* Full notification hub
* Full document management
* Heavy approval workflow
* Enterprise permission matrix
* Real-time chat
* CRM logic
* IT helpdesk logic
* Finance workflow
* AI agent behavior

---

## 25. Portfolio MVP Success Criteria

Portfolio MVP წარმატებულია, თუ visitor / დამსაქმებელი / პოტენციური დამკვეთი ხედავს, რომ პროდუქტი:

* ხსნის რეალურ operational friction-ს
* არ არის უბრალოდ CRUD app
* აქვს მკაფიო user roles
* აქვს structured workflow
* ამცირებს open-text ქაოსს
* აჩვენებს ინდივიდუალურ და ჯგუფურ Issue-ებს
* აჩვენებს ownership transfer-ს
* აჩვენებს curator concept-ს
* აჩვენებს dashboard thinking-ს
* მზად არის მომავალი გაფართოებებისთვის
* მუშაობს online demo-ში
* შეიცავს demo data-ს და reset შესაძლებლობას

პროდუქტი წარუმატებელია, თუ ის აღიქმება როგორც:

* ლამაზი Excel
* generic todo app
* static issue list
* ზედმეტად რთული enterprise tool
* dashboard მხოლოდ მენეჯერის კონტროლისთვის
