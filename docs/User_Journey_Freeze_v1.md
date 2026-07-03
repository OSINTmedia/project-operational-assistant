# User Journey Freeze v1 — Portfolio MVP

## 1. Demo Entry Journey

Demo visitor პირველად ხვდება **Dashboard-ზე**.

Dashboard არის მთავარი შესასვლელი, რადგან პროდუქტის ღირებულება სწრაფად უნდა გამოჩნდეს: რა ხდება პროექტებში, სად არის პრობლემა, რა არის დაბლოკილი, რა იგვიანებს და რა საჭიროებს განახლებას.

Demo-ში გამოიყენება predefined accounts:

* Login as Manager
* Login as Project Manager
* Login as User

ეს აძლევს visitor-ს საშუალებას სწრაფად შეადაროს როლები და დაინახოს, როგორ იცვლება ხედვა სხვადასხვა მომხმარებლისთვის.

---

## 2. Manager Journey

Manager-ის ძირითადი სამუშაო იწყება Dashboard-ით.

Manager ხედავს:

* საერთო operational მდგომარეობას
* პროექტების პროგრესს
* blocked issues
* delayed issues
* needs update count
* issues by project
* issues by owner
* issues by priority
* team-level progress

Manager-ის ძირითადი ქმედებებია:

1. შედის Dashboard-ზე.
2. ხედავს საერთო მდგომარეობას.
3. ფილტრავს პრობლემურ Issue-ებს.
4. შედის კონკრეტულ Issue-ზე.
5. საჭიროების შემთხვევაში ამოწმებს Owner-ს, Curator-ს, Status-ს და Activity History-ს.
6. არ მართავს მიკრო-დავალებებს, თუ ამის საჭიროება არ არის.

Manager-ის journey არ უნდა ჰგავდეს surveillance-ს. მისი მიზანია დაინახოს operational risks, არა თანამშრომლების კონტროლი.

---

## 3. Project Manager Journey

Project Manager არის მთავარი მომხმარებელი.

მისი journey დამოკიდებულია სისტემის მდგომარეობაზე:

### თუ სისტემა ცარიელია

Project Manager ქმნის პირველ პროექტს ან პირველ Issue-ს.

### თუ მონაცემები უკვე არსებობს

Project Manager იწყებს Dashboard-ით:

1. ამოწმებს საერთო მდგომარეობას.
2. ხედავს blocked, delayed და needs update საკითხებს.
3. გადადის Projects-ში.
4. ამოწმებს კონკრეტული პროექტის Issue-ებს.
5. საჭიროების შემთხვევაში ქმნის ახალ Issue-ს.
6. აახლებს status-ს სწრაფი ოპერატიული ღილაკებით.
7. ცვლის Owner-ს, თუ შემდეგი მოქმედება სხვა მომხმარებელზე გადადის.
8. Group Issue-ზე ამოწმებს Curator-ს და მონაწილე წევრებს.
9. საჭიროების შემთხვევაში ადასტურებს ან ხურავს Issue-ს.

Project Manager-ის მთავარი მიზანია დღის operational clarity: რა არის ღია, რა გაჩერდა, რა იგვიანებს, ვინ რას ელოდება და რა საჭიროებს განახლებას.

---

## 4. User Journey

User ხედავს ძირითადად მისთვის რელევანტურ Issue-ებს.

User-ს შეუძლია:

* ნახოს მისთვის assigned Issue-ები
* ნახოს პროექტები, რომლებშიც მონაწილეობს
* განაახლოს საკუთარი Issue-ის status
* შეცვალოს priority ან tag, თუ აქვს უფლება
* გადასცეს Owner სხვა მომხმარებელს, თუ მოქმედება მის მხარეს აღარ არის
* დახუროს Issue, როცა მისი ნაწილი შესრულებულია
* დაადასტუროს Issue, თუ საკითხი მისკენ იყო მიმართული და საბოლოო მიღება მასზეა დამოკიდებული

User არ არის სისტემის ადმინისტრატორი. მისი journey უნდა იყოს სწრაფი და ზარმაც მომხმარებელზე მორგებული.

---

## 5. Issue Creation Journey

Issue-ის შექმნა უნდა იყოს მოკლე.

ძირითადი quick-create ველები:

* Title
* Project
* Status
* Owner

გაფართოებულ რეჟიმში შეიძლება დაემატოს:

* Description
* Type
* Priority
* Tags
* Labels
* Curator
* Dependency

პრინციპი:

Issue-ის შექმნა არ უნდა გახდეს მძიმე ფორმა.

მომხმარებელი ზარმაცია, ამიტომ სისტემა უნდა სთავაზობდეს defaults-ს, autocomplete-ს, მზა status-ებს, მზა tags-ს და სწრაფ ოპერატიულ არჩევანებს.

---

## 6. Group Issue Journey

Group Issue-ის შექმნისას creator ავტომატურად ხდება Curator.

Curator-ის შეცვლა შესაძლებელი უნდა იყოს.

Group Issue-ზე ჩანს:

* Curator
* Owner
* მონაწილე წევრები
* Status
* Priority
* Tags
* Dependency
* Activity History

Group Issue-ის მთავარი წესი:

ყოველ მომენტში უნდა ჩანდეს, ვის მხარესაა შემდეგი მოქმედება.

Curator არ არის ავტომატურად შემსრულებელი. Curator არის კონტექსტის დამჭერი და საკითხის operational clarity-ზე პასუხისმგებელი ადამიანი.

---

## 7. Ownership Transfer Journey

Ownership transfer გამოიყენება მაშინ, როცა Issue-ის შემდეგი მოქმედება გადადის სხვა მომხმარებელზე.

Ownership transfer-ისას:

1. Owner იცვლება.
2. Activity History-ში იწერება ცვლილება.
3. ახალ Owner-ს Issue უჩნდება მის Personal view-ში.
4. Issue იღებს attention signal-ს ახალ Owner-თან.

ეს არ არის notification hub. Portfolio MVP-ში საკმარისია in-app attention signal.

Owner transfer-ის მიზანია გააქროს ბუნდოვანება: “ახლა ვის მხარესაა მოქმედება?”

---

## 8. Status Update Journey

Status update უნდა შეიძლებოდეს ორი გზით:

1. Issue detail გვერდიდან
2. სწრაფი ღილაკებით list/table view-დან

პრიორიტეტულია სწრაფი ღილაკები, რადგან პროდუქტი უნდა ამცირებდეს open-text ქაოსს.

Status update-ისას:

* იცვლება Status
* ახლდება Updated At
* ჩანს Updated By
* Activity History-ში ემატება ჩანაწერი

Default statuses:

* New
* Planned
* Waiting
* Blocked
* Delayed
* In Progress
* Done
* Canceled

---

## 9. Needs Update Journey

Needs Update არ არის ჩვეულებრივი status.

Needs Update არის system label / attention signal.

ის ჩანს ყველგან, სადაც Issue ჩანს, მაგრამ ისე, რომ interface არ გადაიტვირთოს.

თუ Needs Update Issue-ები ბევრია, უნდა ჩანდეს რაოდენობრივი მაჩვენებელი, მაგალითად:

* Needs Update: 7

ამ მაჩვენებელზე დაჭერისას იხსნება შესაბამისი Issue-ების სია.

Needs Update-ის მიზანია აჩვენოს, რომ Issue-ის ბოლო ინფორმაცია აღარ არის საკმარისად სანდო და საჭიროა განახლება.

ეს არ ნიშნავს, რომ სამუშაო არ შესრულდა.

---

## 10. Issue Completion Journey

Issue-ის დახურვისას Status იცვლება Done-ზე.

Portfolio MVP-ში Done ცვლილება იწერება Activity History-ში.

თუ Issue არის ინდივიდუალური და მხოლოდ Owner-ზეა დამოკიდებული, Owner-ს შეუძლია Issue-ის დახურვა.

თუ Issue მიმართულია სხვა მომხმარებლისკენ ან საბოლოო შედეგი უნდა მიიღოს კონკრეტულმა მიმღებმა, მაშინ დახურვა სრულად დასრულებულად არ ითვლება მანამ, სანამ მიმღები არ დაადასტურებს.

ამ შემთხვევაში journey არის:

1. Owner აღნიშნავს Issue-ს როგორც Done ან Ready for Confirmation.
2. მიმღები ხედავს დასადასტურებელ Issue-ს.
3. მიმღები ამოწმებს შედეგს.
4. თუ ყველაფერი სწორია, ადასტურებს დახურვას.
5. თუ არ არის სწორად შესრულებული, აბრუნებს Issue-ს შესაბამის status-ზე.

ეს არ არის მძიმე approval workflow. ეს არის მსუბუქი confirmation logic იმ შემთხვევებისთვის, როცა “მე დავასრულე” არ ნიშნავს “საკითხი სრულად დაიხურა”.

---

## 11. Team Workspace Journey

Team Workspace არის მსუბუქი team-level სივრცე.

ის გამოიყენება ორი მიზნისთვის:

1. გუნდის წევრების და მათთან დაკავშირებული Issue-ების სანახავად.
2. team-level progress-ის სანახავად.

Team Workspace აჩვენებს:

* team members
* assigned issues
* group issues
* blocked issues
* delayed issues
* progress by status
* needs update count

Team Workspace არ უნდა გადაიქცეს complex collaboration, permissions ან organization management სისტემად.

---

## 12. Dashboard Journey

Dashboard არის operational entry point.

Dashboard-ზე მომხმარებელს შეუძლია:

* ნახოს საერთო მდგომარეობა
* გაფილტროს Issue-ები
* მოძებნოს კონკრეტული Issue
* გადავიდეს Issue detail-ზე
* განაახლოს Issue შესაბამისი გვერდიდან
* დაინახოს progress cards და charts

Dashboard არ არის მხოლოდ report. ის არის სამუშაოს დასაწყისი.

Dashboard აჩვენებს:

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

Dashboard-ის მიზანია operational clarity, არა employee scoring.

---

## 13. Demo Journey

Portfolio demo უნდა აჩვენებდეს სრულ ძირითად სცენარს.

Demo visitor უნდა შეძლოს:

1. Login as Manager / PM / User.
2. Dashboard-ზე საერთო მდგომარეობის ნახვა.
3. Project-ში გადასვლა.
4. ახალი Issue-ის შექმნა.
5. Individual Issue-ის და Group Issue-ის გარჩევა.
6. Status-ის სწრაფად შეცვლა.
7. Owner-ის გადაცემა სხვა მომხმარებელზე.
8. Group Issue-ზე Curator-ის ნახვა ან შეცვლა.
9. Needs Update სიგნალის ნახვა.
10. Activity History-ში ცვლილებების დანახვა.
11. Dashboard-ზე metrics/progress ცვლილების დანახვა.
12. Demo data reset-ის გამოყენება.

Demo journey უნდა აჩვენებდეს, რომ პროდუქტი არ არის static task list. ის რეაგირებს ცვლილებებზე, აჩვენებს ownership-ს, progress-ს, history-ს და attention signals-ს.

---

## 14. Onboarding Journey

Portfolio MVP-ში საჭიროა მოკლე helper text-ები და empty-state ტექსტები.

არ არის აუცილებელი სრული step-by-step onboarding.

საკმარისია:

* Dashboard-ზე მოკლე ახსნა
* Projects empty state
* Issues empty state
* Team Workspace helper text
* Needs Update-ის მოკლე განმარტება
* Group Issue-ზე Curator-ის განმარტება

Onboarding-ის მიზანია visitor-მა სწრაფად გაიგოს პროდუქტის ლოგიკა ზედმეტი დოკუმენტაციის გარეშე.

---

## 15. User Journey Success Criteria

User Journey წარმატებულია, თუ demo visitor შეძლებს 5–10 წუთში გაიგოს:

* რა პრობლემას ხსნის პროდუქტი
* რა არის Issue
* რით განსხვავდება Individual და Group Issue
* რას ნიშნავს Owner
* რას ნიშნავს Curator
* როგორ იცვლება Status
* როგორ გადადის Owner
* რას ნიშნავს Needs Update
* როგორ ჩანს Progress Dashboard-ზე
* რატომ არ არის ეს უბრალოდ todo app

User Journey წარუმატებელია, თუ visitor იფიქრებს:

* ეს არის უბრალოდ task list
* გაუგებარია ვის მხარესაა საქმე
* Dashboard მხოლოდ ციფრებია და მოქმედება არ შეიძლება
* Group Issue-ში პასუხისმგებელი მხარე ბუნდოვანია
* Needs Update მაწუხებს და არაფერს მეუბნება
* Status-ები ისევ ტექსტურ ქაოსად გადაიქცა
