// Refresh frequency in milliseconds (every 10 seconds)
import run from 'uebersicht'
export const refreshFrequency = 5000000;
import data from "./lyrics.json";
const url='https://calendar.bloggernepal.com/api/today';


const songs = data;
// Command to fetch data from Hamro Patro's website
// export const command = "curl -s https://calendar.bloggernepal.com/api/today";

// export const command=`curl -s ${url}`

// const commandRunner=()=>{
//   if(!cachedData){
//     return `curl -s ${url}`
//   }
//   else{
//     return null;
//   }
// }

export const command= `curl -s ${url}`


// CSS styling for the widget
export const className = `
  top: 20px;
  left: 20px;
  padding: 15px;
  font-family: Arial;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 10px;
  width: 400px;
  height:300px;
`;

const today = new Date();
const dayIndex = today.getDay();

const nepaliWeeksDays = [
  "आइतवार",
  "सोमवार",
  "मगलवार",
  "बुधवार",
  "बिहिवार",
  "शुक्रवार",
  "शनिवार",
];

const englishMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const engWeekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const fullEnglishDate =
  englishMonths[today.getMonth()] +
  " " +
  today.getDate() +
  ", " +
  `' ` +
  today.getFullYear().toString().slice(2) +
  ", " +
  engWeekDays[dayIndex].slice(0, 3);

let nepaliToDay = nepaliWeeksDays[dayIndex];

//Data Parser
function nepaliDate(data) {
  console.log(data)
  const json = JSON.parse(data);
  const dayArray = json.res.days;
  const todayExistence = dayArray.find((day) => day.tag === "today");

  if (todayExistence) {
    return `${todayExistence.bs}`;
  }
}

function monthParser(data) {
  const json = JSON.parse(data);
  return json.res.name;
}

function yearParser(data) {
  const json = JSON.parse(data);
  return json.res.year;
}


// Render the widget
export const render = ({ output }) => {
  if(output){
  const parsedMainData=JSON.parse(output);
  const todayDate = nepaliDate(output);
  const nepaliMonth = monthParser(output);
  const nepaliYear = yearParser(output);
  const randomIndex = Math.floor(Math.random() * songs.length);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
         <img
          style={{ width: 420 }}
          src="./mainMain.png"
        />
      </div>
      <h1 style={{ marginTop: 10 }}>
        {nepaliMonth + " " + todayDate + ", " + nepaliYear + ", " + nepaliToDay}{" "}
      </h1>
      <h2 style={{ fontStyle: "italic" }}>{fullEnglishDate}</h2>
      <p style={{ fontStyle: "italic" }}>{songs[randomIndex].lyrics}</p>
      <p style={{ fontStyle: "italic" }}>- {songs[randomIndex].creator}</p>
    </div>
  );
}
else{
  const randomIndex = Math.floor(Math.random() * songs.length);
  return(
<div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
         <img
          style={{ width: 420 }}
          src="./mainMain.png"
        />
      </div>
      <h2 style={{ marginTop: 10 }}>
        404: Date Unavailable
      </h2>
      <p style={{ fontStyle: "italic" }}>{songs[randomIndex].lyrics}</p>
      <p style={{ fontStyle: "italic" }}>- {songs[randomIndex].creator}</p>
    </div>

  )
}
};
