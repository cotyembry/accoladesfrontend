import logo from './logo.svg';
import './App.css';
import { WOMClient, Metric } from '@wise-old-man/utils';
import {Component, useState} from 'react';
// import React, { useState } from "react";

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

		this.metric = [
			'EHP',
			'EHB',
			'ABYSSAL_SIRE',
			'ALCHEMICAL_HYDRA',
			'AMOXLIATL',
			'ARAXXOR',
			'ARTIO',
			'BARROWS_CHESTS',
			'BRYOPHYTA',
			'CALLISTO',
			'CALVARION',
			'CERBERUS',
			'CHAMBERS_OF_XERIC',
			'CHAMBERS_OF_XERIC_CM',
			'CHAOS_ELEMENTAL',
			'CHAOS_FANATIC',
			'COMMANDER_ZILYANA',
			'CORPOREAL_BEAST',
			'CRAZY_ARCHAEOLOGIST',
			'DAGANNOTH_PRIME',
			'DAGANNOTH_REX',
			'DAGANNOTH_SUPREME',
			'DERANGED_ARCHAEOLOGIST',
			'DOOM_OF_MOKHAIOTL',
			'DUKE_SUCELLUS',
			'GENERAL_GRAARDOR',
			'GIANT_MOLE',
			'GROTESQUE_GUARDIANS',
			'HESPORI',
			'KALPHITE_QUEEN',
			'KING_BLACK_DRAGON',
			'KRAKEN',
			'KREEARRA',
			'KRIL_TSUTSAROTH',
			'LUNAR_CHESTS',
			'MIMIC',
			'NEX',
			'NIGHTMARE',
			'PHOSANIS_NIGHTMARE',
			'OBOR',
			'PHANTOM_MUSPAH',
			'SARACHNIS',
			'SCORPIA',
			'SCURRIUS',
			'SHELLBANE_GRYPHON',
			'SKOTIZO',
			'SOL_HEREDIT',
			'SPINDEL',
			'TEMPOROSS',
			'THE_GAUNTLET',
			'THE_CORRUPTED_GAUNTLET',
			'THE_HUEYCOATL',
			'THE_LEVIATHAN',
			'THE_ROYAL_TITANS',
			'THE_WHISPERER',
			'THEATRE_OF_BLOOD',
			'THEATRE_OF_BLOOD_HARD_MODE',
			'THERMONUCLEAR_SMOKE_DEVIL',
			'TOMBS_OF_AMASCUT',
			'TOMBS_OF_AMASCUT_EXPERT',
			'TZKAL_ZUK',
			'TZTOK_JAD',
			'VARDORVIS',
			'VENENATIS',
			'VETION',
			'VORKATH',
			'WINTERTODT',
			'YAMA',
			'ZALCANO',
			'ZULRAH',
			'LEAGUE_POINTS',
			'BOUNTY_HUNTER_HUNTER',
			'BOUNTY_HUNTER_ROGUE',
			'CLUE_SCROLLS_ALL',
			'CLUE_SCROLLS_BEGINNER',
			'CLUE_SCROLLS_EASY',
			'CLUE_SCROLLS_MEDIUM',
			'CLUE_SCROLLS_HARD',
			'CLUE_SCROLLS_ELITE',
			'CLUE_SCROLLS_MASTER',
			'LAST_MAN_STANDING',
			'PVP_ARENA',
			'SOUL_WARS_ZEAL',
			'GUARDIANS_OF_THE_RIFT',
			'COLOSSEUM_GLORY',
			'COLLECTIONS_LOGGED',
			'OVERALL',
			'ATTACK',
			'DEFENCE',
			'STRENGTH',
			'HITPOINTS',
			'RANGED',
			'PRAYER',
			'MAGIC',
			'COOKING',
			'WOODCUTTING',
			'FLETCHING',
			'FISHING',
			'FIREMAKING',
			'CRAFTING',
			'SMITHING',
			'MINING',
			'HERBLORE',
			'AGILITY',
			'THIEVING',
			'SLAYER',
			'FARMING',
			'RUNECRAFTING',
			'HUNTER',
			'CONSTRUCTION',
			'SAILING',
		];


		this.state = {
			competitionTitleName: 'Callisto Boss of the Week',
			message: '',
			checkIsRunning: false,
			toUpdate: [],
			noUpdateNeeded: [],
			updateMessage: '',
			selected: '',
			startDate: '',
			endDate: '',
		}
	}
	async componentDidMount() {
				
	}
	async createCompetition() {
		// alert('in create competition');
		// console.log('selected =', this.state.selected);
		// console.log('metric =', this.getMetric());
		// console.log('this.state =', this.state);
		// console.log(this.state.startDate);
		// console.log(addHoursToDate(new Date(this.state.startDate), 5).toISOString())

		const newCompetition = await client.competitions.createCompetition({
			title: this.state.competitionTitleName,
			metric: this.getMetric(),
			startsAt: addHoursToDate(new Date(this.state.startDate), 5).toISOString(), 	//need plus 5 hours to get to central time it seems from my central local time
			endsAt: addHoursToDate(new Date(this.state.endDate), 5).toISOString(),		//need plus 5 hours to get to central time it seems from my central local time
			groupId: 5404,
			groupVerificationCode: '687-342-029',
			// participants: ['psikoi', 'usbc', 'sethmare']
		});

		console.log('->', newCompetition);
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
	getMetric() {
		if (this.state.selected === 'EHP') { return Metric.EHP }
		else if (this.state.selected === 'EHB') { return Metric.EHB }
		else if (this.state.selected === 'ABYSSAL_SIRE') { return Metric.ABYSSAL_SIRE }
		else if (this.state.selected === 'ALCHEMICAL_HYDRA') { return Metric.ALCHEMICAL_HYDRA }
		else if (this.state.selected === 'AMOXLIATL') { return Metric.AMOXLIATL }
		else if (this.state.selected === 'ARAXXOR') { return Metric.ARAXXOR }
		else if (this.state.selected === 'ARTIO') { return Metric.ARTIO }
		else if (this.state.selected === 'BARROWS_CHESTS') { return Metric.BARROWS_CHESTS }
		else if (this.state.selected === 'BRYOPHYTA') { return Metric.BRYOPHYTA }
		else if (this.state.selected === 'CALLISTO') { return Metric.CALLISTO }
		else if (this.state.selected === 'CALVARION') { return Metric.CALVARION }
		else if (this.state.selected === 'CERBERUS') { return Metric.CERBERUS }
		else if (this.state.selected === 'CHAMBERS_OF_XERIC') { return Metric.CHAMBERS_OF_XERIC }
		else if (this.state.selected === 'CHAMBERS_OF_XERIC_CM') { return Metric.CHAMBERS_OF_XERIC_CM }
		else if (this.state.selected === 'CHAOS_ELEMENTAL') { return Metric.CHAOS_ELEMENTAL }
		else if (this.state.selected === 'CHAOS_FANATIC') { return Metric.CHAOS_FANATIC }
		else if (this.state.selected === 'COMMANDER_ZILYANA') { return Metric.COMMANDER_ZILYANA }
		else if (this.state.selected === 'CORPOREAL_BEAST') { return Metric.CORPOREAL_BEAST }
		else if (this.state.selected === 'CRAZY_ARCHAEOLOGIST') { return Metric.CRAZY_ARCHAEOLOGIST }
		else if (this.state.selected === 'DAGANNOTH_PRIME') { return Metric.DAGANNOTH_PRIME }
		else if (this.state.selected === 'DAGANNOTH_REX') { return Metric.DAGANNOTH_REX }
		else if (this.state.selected === 'DAGANNOTH_SUPREME') { return Metric.DAGANNOTH_SUPREME }
		else if (this.state.selected === 'DERANGED_ARCHAEOLOGIST') { return Metric.DERANGED_ARCHAEOLOGIST }
		else if (this.state.selected === 'DOOM_OF_MOKHAIOTL') { return Metric.DOOM_OF_MOKHAIOTL }
		else if (this.state.selected === 'DUKE_SUCELLUS') { return Metric.DUKE_SUCELLUS }
		else if (this.state.selected === 'GENERAL_GRAARDOR') { return Metric.GENERAL_GRAARDOR }
		else if (this.state.selected === 'GIANT_MOLE') { return Metric.GIANT_MOLE }
		else if (this.state.selected === 'GROTESQUE_GUARDIANS') { return Metric.GROTESQUE_GUARDIANS }
		else if (this.state.selected === 'HESPORI') { return Metric.HESPORI }
		else if (this.state.selected === 'KALPHITE_QUEEN') { return Metric.KALPHITE_QUEEN }
		else if (this.state.selected === 'KING_BLACK_DRAGON') { return Metric.KING_BLACK_DRAGON }
		else if (this.state.selected === 'KRAKEN') { return Metric.KRAKEN }
		else if (this.state.selected === 'KREEARRA') { return Metric.KREEARRA }
		else if (this.state.selected === 'KRIL_TSUTSAROTH') { return Metric.KRIL_TSUTSAROTH }
		else if (this.state.selected === 'LUNAR_CHESTS') { return Metric.LUNAR_CHESTS }
		else if (this.state.selected === 'MIMIC') { return Metric.MIMIC }
		else if (this.state.selected === 'NEX') { return Metric.NEX }
		else if (this.state.selected === 'NIGHTMARE') { return Metric.NIGHTMARE }
		else if (this.state.selected === 'PHOSANIS_NIGHTMARE') { return Metric.PHOSANIS_NIGHTMARE }
		else if (this.state.selected === 'OBOR') { return Metric.OBOR }
		else if (this.state.selected === 'PHANTOM_MUSPAH') { return Metric.PHANTOM_MUSPAH }
		else if (this.state.selected === 'SARACHNIS') { return Metric.SARACHNIS }
		else if (this.state.selected === 'SCORPIA') { return Metric.SCORPIA }
		else if (this.state.selected === 'SCURRIUS') { return Metric.SCURRIUS }
		else if (this.state.selected === 'SHELLBANE_GRYPHON') { return Metric.SHELLBANE_GRYPHON }
		else if (this.state.selected === 'SKOTIZO') { return Metric.SKOTIZO }
		else if (this.state.selected === 'SOL_HEREDIT') { return Metric.SOL_HEREDIT }
		else if (this.state.selected === 'SPINDEL') { return Metric.SPINDEL }
		else if (this.state.selected === 'TEMPOROSS') { return Metric.TEMPOROSS }
		else if (this.state.selected === 'THE_GAUNTLET') { return Metric.THE_GAUNTLET }
		else if (this.state.selected === 'THE_CORRUPTED_GAUNTLET') { return Metric.THE_CORRUPTED_GAUNTLET }
		else if (this.state.selected === 'THE_HUEYCOATL') { return Metric.THE_HUEYCOATL }
		else if (this.state.selected === 'THE_LEVIATHAN') { return Metric.THE_LEVIATHAN }
		else if (this.state.selected === 'THE_ROYAL_TITANS') { return Metric.THE_ROYAL_TITANS }
		else if (this.state.selected === 'THE_WHISPERER') { return Metric.THE_WHISPERER }
		else if (this.state.selected === 'THEATRE_OF_BLOOD') { return Metric.THEATRE_OF_BLOOD }
		else if (this.state.selected === 'THEATRE_OF_BLOOD_HARD_MODE') { return Metric.THEATRE_OF_BLOOD_HARD_MODE }
		else if (this.state.selected === 'THERMONUCLEAR_SMOKE_DEVIL') { return Metric.THERMONUCLEAR_SMOKE_DEVIL }
		else if (this.state.selected === 'TOMBS_OF_AMASCUT') { return Metric.TOMBS_OF_AMASCUT }
		else if (this.state.selected === 'TOMBS_OF_AMASCUT_EXPERT') { return Metric.TOMBS_OF_AMASCUT_EXPERT }
		else if (this.state.selected === 'TZKAL_ZUK') { return Metric.TZKAL_ZUK }
		else if (this.state.selected === 'TZTOK_JAD') { return Metric.TZTOK_JAD }
		else if (this.state.selected === 'VARDORVIS') { return Metric.VARDORVIS }
		else if (this.state.selected === 'VENENATIS') { return Metric.VENENATIS }
		else if (this.state.selected === 'VETION') { return Metric.VETION }
		else if (this.state.selected === 'VORKATH') { return Metric.VORKATH }
		else if (this.state.selected === 'WINTERTODT') { return Metric.WINTERTODT }
		else if (this.state.selected === 'YAMA') { return Metric.YAMA }
		else if (this.state.selected === 'ZALCANO') { return Metric.ZALCANO }
		else if (this.state.selected === 'ZULRAH') { return Metric.ZULRAH }
		else if (this.state.selected === 'LEAGUE_POINTS') { return Metric.LEAGUE_POINTS }
		else if (this.state.selected === 'BOUNTY_HUNTER_HUNTER') { return Metric.BOUNTY_HUNTER_HUNTER }
		else if (this.state.selected === 'BOUNTY_HUNTER_ROGUE') { return Metric.BOUNTY_HUNTER_ROGUE }
		else if (this.state.selected === 'CLUE_SCROLLS_ALL') { return Metric.CLUE_SCROLLS_ALL }
		else if (this.state.selected === 'CLUE_SCROLLS_BEGINNER') { return Metric.CLUE_SCROLLS_BEGINNER }
		else if (this.state.selected === 'CLUE_SCROLLS_EASY') { return Metric.CLUE_SCROLLS_EASY }
		else if (this.state.selected === 'CLUE_SCROLLS_MEDIUM') { return Metric.CLUE_SCROLLS_MEDIUM }
		else if (this.state.selected === 'CLUE_SCROLLS_HARD') { return Metric.CLUE_SCROLLS_HARD }
		else if (this.state.selected === 'CLUE_SCROLLS_ELITE') { return Metric.CLUE_SCROLLS_ELITE }
		else if (this.state.selected === 'CLUE_SCROLLS_MASTER') { return Metric.CLUE_SCROLLS_MASTER }
		else if (this.state.selected === 'LAST_MAN_STANDING') { return Metric.LAST_MAN_STANDING }
		else if (this.state.selected === 'PVP_ARENA') { return Metric.PVP_ARENA }
		else if (this.state.selected === 'SOUL_WARS_ZEAL') { return Metric.SOUL_WARS_ZEAL }
		else if (this.state.selected === 'GUARDIANS_OF_THE_RIFT') { return Metric.GUARDIANS_OF_THE_RIFT }
		else if (this.state.selected === 'COLOSSEUM_GLORY') { return Metric.COLOSSEUM_GLORY }
		else if (this.state.selected === 'COLLECTIONS_LOGGED') { return Metric.COLLECTIONS_LOGGED }
		else if (this.state.selected === 'OVERALL') { return Metric.OVERALL }
		else if (this.state.selected === 'ATTACK') { return Metric.ATTACK }
		else if (this.state.selected === 'DEFENCE') { return Metric.DEFENCE }
		else if (this.state.selected === 'STRENGTH') { return Metric.STRENGTH }
		else if (this.state.selected === 'HITPOINTS') { return Metric.HITPOINTS }
		else if (this.state.selected === 'RANGED') { return Metric.RANGED }
		else if (this.state.selected === 'PRAYER') { return Metric.PRAYER }
		else if (this.state.selected === 'MAGIC') { return Metric.MAGIC }
		else if (this.state.selected === 'COOKING') { return Metric.COOKING }
		else if (this.state.selected === 'WOODCUTTING') { return Metric.WOODCUTTING }
		else if (this.state.selected === 'FLETCHING') { return Metric.FLETCHING }
		else if (this.state.selected === 'FISHING') { return Metric.FISHING }
		else if (this.state.selected === 'FIREMAKING') { return Metric.FIREMAKING }
		else if (this.state.selected === 'CRAFTING') { return Metric.CRAFTING }
		else if (this.state.selected === 'SMITHING') { return Metric.SMITHING }
		else if (this.state.selected === 'MINING') { return Metric.MINING }
		else if (this.state.selected === 'HERBLORE') { return Metric.HERBLORE }
		else if (this.state.selected === 'AGILITY') { return Metric.AGILITY }
		else if (this.state.selected === 'THIEVING') { return Metric.THIEVING }
		else if (this.state.selected === 'SLAYER') { return Metric.SLAYER }
		else if (this.state.selected === 'FARMING') { return Metric.FARMING }
		else if (this.state.selected === 'RUNECRAFTING') { return Metric.RUNECRAFTING }
		else if (this.state.selected === 'HUNTER') { return Metric.HUNTER }
		else if (this.state.selected === 'CONSTRUCTION') { return Metric.CONSTRUCTION }
		else if (this.state.selected === 'SAILING') { return Metric.SAILING }
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
						<Dropdown options={this.metric} onChange={handleSelection} setState={this.setState} />
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

function DateTimePickerStart({onChange}) {
  // Initialize with current local date & time
  const [startDate, setDateTime] = useState(() => {
    const now = new Date();
    // Adjust for local timezone so it matches the user's clock
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
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
      />
      {/* <p>Selected: {startDate}</p> */}
    </div>
  );
}

function DateTimePickerEnd({onChange}) {
  // Initialize with current local date & time
  const [endDate, setDateTime] = useState(() => {
    const now = new Date();
    // Adjust for local timezone so it matches the user's clock
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
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
      />
      {/* <p>Selected: {endDate}</p> */}
    </div>
  );
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
