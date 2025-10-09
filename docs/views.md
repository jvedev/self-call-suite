

# login view
- input for username
- input foor password
- button to submit
- button to register view
- button forgot password
- error message display

# register view
- input for username
- input for email
- input for password
- input for confirm password
- button to submit
- back button to login view
- error message display
- when registering a user the user should be automatically logged in and redirected to the home view

# forgot password view
- input for username or email
- button to submit
- back button to login view
- error message display

# Home view
- new match button forward to new match view
- match settings button
- past matches button
- user settings button

# new match view
- input for red fighter username
- input for blue fighter username
- start match button
- back button to home view
- error message display
- when starting a match the user should be redirected to the match view

# match view
- a countdown timer 
  - clicking on the timer will open the adjust time view
  - the timer wil become orange when the last exchange time starts last exchange time is set in settings
  - when sudden death is applicable the timer wil become red and start counting up
- red fighter score
- blue fighter score
- hit button registers the time and navigates to hit view
- warning button registers the time and navigates to warning view
- timeout button pauses the time and logs this event when paused it wil change to resume button when this is clicked the time will regume and log this event
- a game log showing the last 5 events clicking this button will open an alter game event view

# hit view
in the header it wil show hit and the time the hit occured this is not the count remaining time but the playing time
here we can register points for a hit
we have a row off buttons for red
a row for blue the score button row typicaly have 0 2 3 but there might be more or les this is all depending on the settings the are radio buttons only one can be selected 
under this row we have a order row  red first , blue first and double button these are radio buttons only one can be selected
under this row we have a hit button
and last we have a no score button 

### logic for hit view
the order row is shown is hidden unless both players have a score
the no score button is available at all times
when no player has a score the order row is hidden and the hit button is disabled
when only one player has a score the hit button is enabled  
when both players have a score the order row is shown hit is disabled
when a selection in the order row is made the hit button is enabled

double hit and noscore wil register the event in the game log and will calculate the score accordingly
after registering the event the user is navigated back to the match view

# warning view
in the header it wil show warning and the time the warning occured this is not the count remaining time but the playing time
here we can register warnings for a player
we have red or blue selector these are radio buttons only one can be selected
under this we have a row we can scroll through with warning types 
clicking a warning type will select it
under this we have a add warning button this warning wil register the warning in the match log and return to the match view

# time out view 
in the header it wil show timeout and the time the timeout occured this is not the count remaining time but the playing time
her we can register the reason for the timeout
we have the option for red blue judges or gear.
these are radio buttons only one can be selected
we have a ok button this wil register the timeout in the match log and return to the match view

# adjust time view
here we have the registered time in minutes and seconds as is shown in the count down clock 
it will not change 
the minutes and seconds can be adjusted 
we have a ok button this wil adjust the time in the match view and return to the match view
there is a cancel button this wil return to the match view without adjusting the time

# user settings view
in this view you can set 
- dark or light mode 
- language
- alter you're password
- set more settings in the future

# match settings view
in this view you can set
- match duration default 3 minutes
- sudden death yes or no default no
- last exchange time default 15 seconds
- rightofway yes or no default no 
- count mode normal or diference only 
- count doubles yes or no default no
- count after blow yes or no default yes
- extend last boud 0 or any ammount of seconds default 0
- extentions last boud 0 or any number default 0
- bouds per match 1 or any number default 1
- score values 0 2 3 or any number of score values in an array default [0, 2, 3]
- ring as string indicating the ring in the venue default "" 
- event as string indicating the event default ""
- warnings an array off strings indicating warnings like:
  const warnings: string[] = [
  "Late for a fight",
  "Turning the back",
  "Forbidden target Feet, back, groin",
  "Throw",
  "Chokeholds or breaking techniques",
  "Throwing the weapon",
  "Hitting the floor with the weapon",
  "Unnecessary non-scoring violence",
  "Offensively using the crossguard",
  "Using disproportionate force",
  "Continuing to fight after break",
  "Talking to the table or jury",
  "Swearing, cursing, or shouting",
  "dismissing a point"
  "being a dick"
  ];