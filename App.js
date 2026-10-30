import logo from './logo.svg';
import './App.css';
import { WOMClient, Metric, METRICS } from '@wise-old-man/utils';
import {Component, useState} from 'react';

const client = new WOMClient({
	apiKey: 'f2lt6fmp4e6yipahvm47sbld',
	userAgent: 'cotyembry'
});

async function timeoutFor70Seconds(dataObject = {i: 0, membershipsLength: 0, setState: () => {},}) {
	//`processed ${i + 1} of ${memberships.length} so far - waiting for 70 seconds due to api limit constraints`
	let {
		i = 0,
			membershipsLength = 0,
			setState = () => {},
		} = dataObject;
	//
	let cancelId = null,
		timeLeft = 70;

	function oneSecondTimeout() {
		// if (cancelId !== null) window.clearTimeout(cancelId);
		//
		cancelId = setTimeout(() => {
			timeLeft = timeLeft - 1;
			// console.log('in 1 second callback', {
			// 	message: `processed ${i + 1} of ${membershipsLength} so far - waiting for ${timeLeft} seconds due to api limit constraints`,
			// 	setState: setState,
			// })
			setState({
				message: `processed ${i + 1} of ${membershipsLength} so far - waiting for ${timeLeft} seconds due to api limit constraints`
			});
			oneSecondTimeout();
		}, 1000)
	}
	oneSecondTimeout();
	//
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (cancelId !== null) window.clearTimeout(cancelId);
			//
			resolve();
			//
		}, 70000);
	})
}
function isTotalRankType(rank, ranks) {
	return ranks.hasOwnProperty(rank);
}

function addHoursToDate(date, hours) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Invalid Date object provided.");
    }
    if (typeof hours !== "number" || !isFinite(hours)) {
        throw new Error("Hours must be a valid number.");
    }

    // Convert hours to milliseconds and add to current time
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    return date;
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// competitionTitleName: 'Callisto Boss of the Week',
			competitionTitleName: 'Raid of the Week',
			message: '',
			checkIsRunning: false,
			toUpdate: [],
			noUpdateNeeded: [],
			updateMessage: '',
			selected: '',
			startDate: convertToLocalDateTimeFromUTC(getThisSundayMidnight()),
			endDate: convertToLocalDateTimeFromUTC(getSaturdayAfterSunday(getThisSundayMidnight())),
		}
	}
	async componentDidMount() {
				
	}
	async createCompetition() {		
		let startDate = new Date(this.state.startDate),
			endDate = new Date(this.state.endDate);
		//
		console.log('creating wise old man competition...');

		if (this.state.selected === '') {
			alert('Please select a competition option to continue');

			return;
		}

		const newCompetition = await client.competitions.createCompetition({
			title: this.state.competitionTitleName,
			metric: Metric[this.state.selected],
			// startsAt: addHoursToDate(new Date(this.state.startDate), 5).toISOString(), 	//need plus 5 hours to get to central time it seems from my central local time
			// endsAt: addHoursToDate(new Date(this.state.endDate), 5).toISOString(),		//need plus 5 hours to get to central time it seems from my central local time
			startsAt: startDate,
			endsAt: endDate,
			groupId: 5404,
			groupVerificationCode: '687-342-029',
			// participants: ['psikoi', 'usbc', 'sethmare']
		});

		console.log('done:', newCompetition, ', now creating discord event...');

		const eventData = {
			name: this.state.competitionTitleName,
			privacy_level: 2, // GUILD_ONLY
			scheduled_start_time: startDate.toString(),
			scheduled_end_time: endDate.toString(),
			entity_type: 3, // EXTERNAL
			entity_metadata_location: "Gielinor",
			description: `${this.state.competitionTitleName}\n\nhttps://wiseoldman.net/competitions/${newCompetition.competition.id}`
		};

		const url = new URL(`https://accolades.apps.bot-hosting.cloud/createEvent`);
		url.search = new URLSearchParams(eventData).toString();

		//@TODO - still getting a error: Access to fetch at 'https://accolades.apps.bot-hosting.cloud/createEvent?name=testing+event+name&privacy_level=2&scheduled_start_time=Sun+Nov+01+2026+00%3A00%3A00+GMT-0500+%28Central+Daylight+Time%29&scheduled_end_time=Sat+Nov+07+2026+23%3A59%3A00+GMT-0600+%28Central+Standard+Time%29&entity_type=3&entity_metadata_location=Gielinor&description=Raid+of+the+Week%0A%0Ahttps%3A%2F%2Fwiseoldman.net%2Fcompetitions%2F163626' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
		fetch(
			url.href
			
		)
			.then(res => res.json())
			.then(data => console.log("Event created:", data))
			.catch(err => console.error("Error:", err));

		// fetch(
		// 	url,
		// 	{
		// 		method: 'GET',
		// 		mode: 'no-cors'
		// 	}
		// )
		// 	.then(res => res.json())
		// 	.then(data => console.log("Event created:", data))
		// 	.catch(err => console.error("Error:", err));
		
	}
	async runCheck() {
		// 
		//Note: There is a maximum of 20 requests per 60 seconds, however, this can be increased (to 100) if you register for an API key.
		//
		if (this.state.checkIsRunning === false) {
			// Use this client to send requests
			const groups = await client.groups.getGroupDetails(5404),
				{memberships = []} = groups,
				requestCount = 0,
				ranks = {
					'sapphire': '',
					'emerald': '',
					'ruby': '',
					'diamond': '',
					'dragonstone': '',
					'onyx': '',
					'zenyte': '',
					'maxed': '',
				},
				collectionLogRanks = {
					'adventurer': '',
					'explorer': '',
					'red_topaz': '',
					'gamer': '',
					'raider': '',
					'elite': '',
					'completionist': '',
				},
				adminRanks = {
					'owner': '',
					'deputy_owner': '',
					'administrator': '',
				},
				bossOfTheWeekRanks = {
					'master': '',
					'officer': '',
					'commander': '',
				},
				skillOfTheWeekRanks = {
					'colonel': '',
					'brigadier': '',
					'admiral': '',
				},
				vanityRanks = {
					'mediator': '',
				},
				resultsOfPeopleWhoDoNotNeedUpdated = [],
				toUpdate = [];
			//
			//
			for (let i = 0; i < memberships.length; i++) {
				this.setState({
					message: `processed ${i + 1} of ${memberships.length} so far`,
				})
				let playerDetails = await client.players.getPlayerDetailsById(memberships[i].playerId),
					rank = memberships[i].role,
					{
					latestSnapshot = {},
					username = '',
					} = playerDetails;

				if (latestSnapshot === null) {
					//if here this usually means they are a low level with no stats data
					latestSnapshot = {};
					// console.log('latestSnapshot =', latestSnapshot)
					// console.log('->', username, rank);
					//latestSnapshotf = {}; console.log('username =', username, rank, latestSnapshot, playerDetails);
				}	
				let	{data = {}} = latestSnapshot,
					{skills = {}} = data,
					{overall = {}} = skills,
					{
					level = 0,
					// rank = '',
					} = overall;
					
				//
				if (i !== 0 && i % 30 === 0) {
					// console.log(`processed ${i + 1} of ${memberships.length} so far - waiting for 70 seconds due to api limit constraints`)
					this.setState({
						message: `processed ${i + 1} of ${memberships.length} so far - waiting for 70 seconds due to api limit constraints`
					})
					await timeoutFor70Seconds({
						i,
						membershipsLength: memberships.length,
						setState: (state = {}) => {
							this.setState(state);
						}
					})
				}
				// console.log(username, level, rank)
				if (ranks.hasOwnProperty(rank)) {
					if (level >= 0 && level <= 499) {
					//sapphire
						if (rank !== 'sapphire') {
							toUpdate.push(`${username} needs to be updated to sapphire - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 500 && level <= 999) {
						//emerald
						if (rank !== 'emerald') {
							toUpdate.push(`${username} needs to be updated to emerald - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1000 && level <= 1499) {
						//ruby
						if (rank !== 'ruby') {
							toUpdate.push(`${username} needs to be updated to ruby - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1500 && level <= 1749) {
						//diamond
						if (rank !== 'diamond') {
							toUpdate.push(`${username} needs to be updated to diamond - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1750 && level <= 1999) {
						//dragonstone
						if (rank !== 'dragonstone') {
							toUpdate.push(`${username} needs to be updated to dragonstone - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 2000 && level <= 2199) {
						//onyx
						if (rank !== 'onyx') {
							toUpdate.push(`${username} needs to be updated to onyx - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 2200 && level <= 2375) {
						//zenyte
						if (rank !== 'zenyte') {
							toUpdate.push(`${username} needs to be updated to zenyte - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level === 2376) {
					//maxed
						if (rank !== 'maxed' ) {
						 	toUpdate.push(`${username} needs to be updated to maxed - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
				}
				else {
					resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
				}
				//
				this.setState({
					toUpdate,
					noUpdateNeeded: resultsOfPeopleWhoDoNotNeedUpdated,
				})
			}
		}
	}
	async getAndUpdatePlayers() {
		// 
		//Note: There is a maximum of 20 requests per 60 seconds, however, this can be increased (to 100) if you register for an API key.
		//
		if (this.state.checkIsRunning === false) {
			// Use this client to send requests
			const groups = await client.groups.getGroupDetails(5404),
				{memberships = []} = groups,
				requestCount = 0,
				ranks = {
					'sapphire': '',
					'emerald': '',
					'ruby': '',
					'diamond': '',
					'dragonstone': '',
					'onyx': '',
					'zenyte': '',
					'maxed': '',
				},
				collectionLogRanks = {
					'adventurer': '',
					'explorer': '',
					'red_topaz': '',
					'gamer': '',
					'raider': '',
					'elite': '',
					'completionist': '',
				},
				adminRanks = {
					'owner': '',
					'deputy_owner': '',
					'administrator': '',
				},
				bossOfTheWeekRanks = {
					'master': '',
					'officer': '',
					'commander': '',
				},
				skillOfTheWeekRanks = {
					'colonel': '',
					'brigadier': '',
					'admiral': '',
				},
				vanityRanks = {
					'mediator': '',
				},
				resultsOfPeopleWhoDoNotNeedUpdated = [],
				toUpdate = [];
			//
			//
			for (let i = 0; i < memberships.length; i++) {
				// if (i === 0) {
				// 	this.setState({
				// 		message: `waiting for 70 seconds due to api limit constraints`
				// 	})
				// 	await timeoutFor70Seconds()
				// }
				this.setState({
					message: `processed ${i + 1} of ${memberships.length} so far`,
				})
				let playerDetails = {},
					latestSnapshot = {},
					username = '';
				try {
					playerDetails = await client.players.updatePlayer(memberships[i].player.username);
					latestSnapshot = playerDetails.hasOwnProperty('latestSnapshot') ? playerDetails.latestSnapshot : {};
					username = playerDetails.hasOwnProperty('username') ? playerDetails.username : '';
					console.log('updated', i, username)
				}
				catch(error) {
					console.log('error updating i=', i, 'username=', memberships[i].player.username);
					username = memberships[i].player.username;
				}
				let rank = memberships[i].role;	
				let	{data = {}} = latestSnapshot,
					{skills = {}} = data,
					{overall = {}} = skills,
					{
					level = 0,
					// rank = '',
					} = overall;
					
				//
				if (i !== 0 && i % 30 === 0) {
					// console.log(`processed ${i + 1} of ${memberships.length} so far - waiting for 70 seconds due to api limit constraints`)
					this.setState({
						message: `processed ${i + 1} of ${memberships.length} so far - waiting for 70 seconds due to api limit constraints`
					})
					await timeoutFor70Seconds()
				}
				// console.log(username, level, rank)
				if (ranks.hasOwnProperty(rank)) {
					if (level >= 0 && level <= 499) {
					//sapphire
						if (rank !== 'sapphire') {
							toUpdate.push(`${username} needs to be updated to sapphire - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 500 && level <= 999) {
						//emerald
						if (rank !== 'emerald') {
							toUpdate.push(`${username} needs to be updated to emerald - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1000 && level <= 1499) {
						//ruby
						if (rank !== 'ruby') {
							toUpdate.push(`${username} needs to be updated to ruby - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1500 && level <= 1749) {
						//diamond
						if (rank !== 'diamond') {
							toUpdate.push(`${username} needs to be updated to diamond - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 1750 && level <= 1999) {
						//dragonstone
						if (rank !== 'dragonstone') {
							toUpdate.push(`${username} needs to be updated to dragonstone - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 2000 && level <= 2199) {
						//onyx
						if (rank !== 'onyx') {
							toUpdate.push(`${username} needs to be updated to onyx - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level >= 2200 && level <= 2375) {
						//zenyte
						if (rank !== 'zenyte') {
							toUpdate.push(`${username} needs to be updated to zenyte - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level === 2376) {
					//maxed
						if (rank !== 'maxed' ) {
							toUpdate.push(`${username} needs to be updated to maxed - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
				}
				//
				this.setState({
					toUpdate,
					noUpdateNeeded: resultsOfPeopleWhoDoNotNeedUpdated,
				})
			}
		}
	}
	onTitleChange = (e) => {
		// console.log(e.nativeEvent.data);
		// let value = e.nativeEvent.data;
		this.setState({competitionTitleName: e.target.value,});
	}
	render() {
		const handleSelection = (value) => {
			this.setState({
				selected: value,
			})
		};
		const handleStartDate = (value) => {
			this.setState({
				startDate: value,
			})
		};
		const handleEndDate = (value) => {
			this.setState({
				endDate: value,
			})
		}
		return (
			<div className="App" >
				<div  
					style={{
						// position: 'absolute',
						width: '100%',
						// height: '30px',
						boxSizing: 'border-box',
						borderRadius: '4px',
						border: 'solid 1px black',
					}}
				>
					{this.state.message}
				</div>
				<div style={{display: 'flex',}}>
					<div
						style={{
							// paddingTop: '30px',
							flex: 1,
						}}
					>
						<div style={{...styles.header, backgroundColor: 'red', color: 'white',}}>To Update</div>
						<div>Count: {this.state.toUpdate.length}</div>
						<div
							style={{
								...styles.Button,
							}}
							tooltip='click to update clan members'
							onClick={async () => {
								this.runCheck();
							}}
						>
							{'Click to check clan members ranks'}
						</div>
							{this.state.toUpdate.map((value, i) =>
								<div key={i} style={styles.border}>{value}</div>
							)}
					</div>
					<div
						style={{
							// paddingTop: '30px',
							flex: 1,
						}}
					>
						<div style={{...styles.header}}>No Update Needed</div>
						<div>Count: {this.state.noUpdateNeeded.length}</div>
						{this.state.noUpdateNeeded.map((value, i) =>
							<div key={i} style={styles.border}>{value}</div>
						)}
					</div>
					<div
						style={{
							// paddingTop: '30px',
							flex: 1,
						}}
					>
						<div style={{...styles.header, backgroundColor: 'blue', color: 'white'}}>Update Message</div>
						<div
							style={{
								...styles.Button,
							}}
							tooltip='Click to update out of date clan members (members not updated >24 hours)'
							onClick={async () => {
								let {message = '',} = await client.groups.updateAll(5404, '687-342-029');
								this.setState({
									updateMessage: message,
								})
							}}
						>
							{this.state.updateMessage === '' ? 'Click to update out of date clan members (members not updated >24 hours)' : <div>{this.state.updateMessage}<br/><br/>{'Click to update clan members (members not updated >24 hours)'}</div>}
						</div>
					</div>
					<div
						style={{
							// paddingTop: '30px',
							flex: 1,
						}}
					>
						<div style={{...styles.header, backgroundColor: 'blue', color: 'white'}}>Update Message</div>
						<div
							style={{
								...styles.Button,
							}}
							tooltip='click to update individual clan members (takes longer)'
							onClick={async () => {
								this.getAndUpdatePlayers();
							}}
						>
							{this.state.updateMessage === '' ? 'Click to update individual clan members (takes longer)' : <div>{this.state.updateMessage}<br/><br/>{'Click to update individual clan members (takes longer)'}</div>}
						</div>
					</div>
				</div>
				<div style={{border: '1px solid white', borderRadius: '4px',}}>
					Competition Title: <input value={this.state.competitionTitleName} id='competitionTitleInput' onChange={this.onTitleChange} />
						<Dropdown options={Object.keys(Metric)} onChange={handleSelection} setState={this.setState} />
						<br />
						{/* Start
							Jul 13, 12:00 AM 
							End
							Jul 19, 11:59 PM */}
						{/* <DatePickerExample />
						<DatePickerEnd /> */}
						<DateTimePickerStart onChange={handleStartDate} />
						<DateTimePickerEnd onChange={handleEndDate} />
				
					<div style={{display: 'flex',}}>
						<div
							style={{
								...styles.Button,
							}}
							tooltip='click to create competition'
							onClick={async () => {
								this.createCompetition();
							}}
						>
							
							{'Click to create competition'}
						</div>	
					</div>
				</div>
			</div>
		);
	}
}

function getThisSundayMidnight() {
    const now = new Date();

    // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const currentDay = now.getDay();

    // Calculate days until Sunday (0 means today is Sunday)
    const daysUntilSunday = (7 - currentDay) % 7;

    // Create new Date for Sunday
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + daysUntilSunday);

    // Set time to midnight (00:00:00.000)
    sunday.setHours(0, 0, 0, 0);
    return sunday;
}
/**
 * Returns the Saturday after a given Sunday date at 11:59 PM.
 * @param {Date} sundayDate - The Sunday date (midnight) from getThisSundayMidnight().
 */
function getSaturdayAfterSunday(sundayDate) {
    if (!(sundayDate instanceof Date) || isNaN(sundayDate)) {
        throw new Error("Invalid Date object provided.");
    }

    const saturday = new Date(sundayDate);
    saturday.setDate(sundayDate.getDate() + 6); // Saturday after Sunday
    saturday.setHours(23, 59, 0, 0); // 11:59 PM

    return saturday;
}
function DateTimePickerStart({onChange}) {
  // Initialize with current local date & time
  const [startDate, setDateTime] = useState(() => {
    // const now = new Date();
    // // Adjust for local timezone so it matches the user's clock
    // const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    // return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
	return convertToLocalDateTimeFromUTC(getThisSundayMidnight().toISOString()); //.slice(0, 16);
  });

  // Handle change
  const handleChange = (e) => {
	let value = e.target.value;
    setDateTime(value);
	if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <label htmlFor="dateTimeInput">Start date and time: </label>
      <input
        id="dateTimeInput"
        type="datetime-local"
        value={startDate}
        onChange={handleChange}
		// timezone="system"
      />
      {/* <p>Selected: {startDate}</p> */}
    </div>
  );
}

function DateTimePickerEnd({onChange}) {
  // Initialize with current local date & time
  const [endDate, setDateTime] = useState(() => {
    // const now = new Date();
    // // Adjust for local timezone so it matches the user's clock
    // const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    // return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
	let sundayMidnight = getThisSundayMidnight(),
		saturdayTime = getSaturdayAfterSunday(sundayMidnight);
	return convertToLocalDateTimeFromUTC(saturdayTime.toISOString()); //.slice(0, 16);
  });

  // Handle change
  const handleChange = (e) => {
	let value = e.target.value;
    setDateTime(value);
	if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <label htmlFor="dateTimeInput">End date and time: </label>
      <input
        id="dateTimeInput"
        type="datetime-local"
        value={endDate}
        onChange={handleChange}
		// timezone="system"
      />
      {/* <p>Selected: {endDate}</p> */}
    </div>
  );
}
function convertToLocalDateTimeFromUTC(utcString) {
    // Parse the UTC date
    const utcDate = new Date(utcString);

    // Get local components
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');

    // Format for datetime-local (no timezone)
    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Assign to input
    return localDateTime;
}

/**
 * Dropdown component using vanilla HTML <select> and <option>
 * @param {Array} options - Array of { value: string, label: string }
 * @param {Function} onChange - Callback when selection changes
 */
function Dropdown({ options, onChange, setState }) {
  const [selected, setSelected] = useState("");

  // Handle selection change
  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  // Validate options prop
  if (!Array.isArray(options) || options.length === 0) {
    return <p>No options available</p>;
  }

  return (
    <select value={selected} onChange={handleChange}>
      <option value="" disabled>
        -- Select an option --
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}


const styles = {
	header: {
		width: '100%',
		minHeight: '30px',
		border: 'solid 1px black', boxSizing: 'border-box', borderRadius: '4px',
	},
	border: {
		border: 'solid 1px white',
		borderRadius: '4px',
	},
	Button: {
		cursor: 'pointer',
		backgroundColor: '#04AA6D',
		border: 'solid 2px white',
		boxSizing: 'border-box',
		color: 'white',
		padding: '15px 32px',
		borderRadius: '4px',
		textAlign: 'center',
		textDecoration: 'none',
		display: 'inline-block',
		fontSize: '16px',
	}
}

export default App;
