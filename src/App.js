import logo from './logo.svg';
import './App.css';
import { WOMClient } from '@wise-old-man/utils';
import {Component} from 'react';

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

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: '',
			checkIsRunning: false,
			toUpdate: [],
			noUpdateNeeded: [],
			updateMessage: '',
		}
	}
	async componentDidMount() {
				
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
					else if (level >= 2200 && level <= 2276) {
						//zenyte
						if (rank !== 'zenyte') {
							toUpdate.push(`${username} needs to be updated to zenyte - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level === 2277) {
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
					else if (level >= 2200 && level <= 2276) {
						//zenyte
						if (rank !== 'zenyte') {
							toUpdate.push(`${username} needs to be updated to zenyte - api says their total level is: ${level}`)
						}
						else resultsOfPeopleWhoDoNotNeedUpdated.push(`username: ${username} rank: ${rank} totalLevel: ${level}`)
					}
					else if (level === 2277) {
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
	render() {
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
								// paddingTop: '30px',
								cursor: 'pointer',
								backgroundColor: '#04AA6D',
								border: 'none',
								color: 'white',
								padding: '15px 32px',
								borderRadius: '4px',
								textAlign: 'center',
								textDecoration: 'none',
								display: 'inline-block',
								fontSize: '16px',
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
								cursor: 'pointer',
								backgroundColor: '#04AA6D',
								border: 'none',
								color: 'white',
								padding: '15px 32px',
								borderRadius: '4px',
								textAlign: 'center',
								textDecoration: 'none',
								display: 'inline-block',
								fontSize: '16px',
							}}
							tooltip='Click to update out of date clan members (members not updated >24 hours)'
							onClick={async () => {
								let {message = '',} = await client.groups.updateAll(5404, '956-841-933');
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
								cursor: 'pointer',
								backgroundColor: '#04AA6D',
								border: 'none',
								color: 'white',
								padding: '15px 32px',
								borderRadius: '4px',
								textAlign: 'center',
								textDecoration: 'none',
								display: 'inline-block',
								fontSize: '16px',
							}}
							tooltip='click to update individual clan members'
							onClick={async () => {
								this.getAndUpdatePlayers();
							}}
						>
							{this.state.updateMessage === '' ? 'Click to update individual clan members' : <div>{this.state.updateMessage}<br/><br/>{'Click to update individual clan members'}</div>}
						</div>
					</div>
				</div>
			</div>
		);
	}
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
	}
}

export default App;
