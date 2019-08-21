import React, { useState, useEffect } from 'react';
import EventPageHeader from './EventPageHeader';
import EventPageTabs from './EventPageTabs';
import EventPageTabBody from './EventPageTabBody';
import './EventPage.scss';
import UserEvents from '../UserPage/UserEvents/UserEvents';
import {
	formatToClient,
	IEventFormatDataBase,
	IDiscussionUser
} from '../UserPage/UserEvents/UserEvents.service';
import Spinner from '../shared/Spinner';

export interface IEvent {
	title: string;
	description: string;
	location: string;
	date: string;
	photo: string;
	isPrivate: boolean;
}

interface IProps {
	match: {
		url: string;
		params: {
			id: string;
		};
	};
	getEventById: (eventId: string) => void;
	searchedEvent: IEventFormatDataBase;
	currentUser: IDiscussionUser;
}

const EventPage: React.FC<IProps> = ({
	match,
	getEventById,
	searchedEvent,
	currentUser
}) => {
	const { url: mainPath } = match;
	const [event, setEvent] = useState();
	console.log(match);
	useEffect(() => {
		if (!event) {
			getEventById(match.params.id);
			searchedEvent && setEvent(formatToClient(searchedEvent));

			console.log('hello', searchedEvent);
		}
	});

	if (!event) return <Spinner />;
	return (
		<div>
			<EventPageHeader event={event} />
			<div className="event-page-main">
				<EventPageTabs mainPath={mainPath} />
				<EventPageTabBody
					mainPath={mainPath}
					event={event}
					currentUser={currentUser}
				/>
			</div>
		</div>
	);
};

export default EventPage;
