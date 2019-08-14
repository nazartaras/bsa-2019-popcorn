import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from '../../shared/Spinner/index';
import { getUserEvents, saveEvent, deleteEvent } from './actions';

import {
	IEventFormatDataBase,
	IEventFormatClient,
	formatToClient
} from './UserEvents.service';
import EventItem from './EventItem/EventItem';
import './UserEvents.scss';
import UserEventsEditor from './UserEventsEditor/UserEventsEditor';

interface IProps {
	userEvents: IEventVisitor[];
	getUserEvents: (id: string) => any;
	deleteEvent: (id: string, currentUserId: string) => any;
	currentUserId: string;
	saveEvent: (event: any) => void;
}

interface IEventVisitor {
	eventId: string;
	id: string;
	status: string;
	event: IEventFormatDataBase;
}

class UserEvents extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
	}

	componentDidMount() {
		const { currentUserId } = this.props;
		this.props.getUserEvents(currentUserId);
	}

	renderEventList = (eventList: IEventFormatClient[], deleteEventAction: any) =>
		eventList.map(event => (
			<EventItem event={event} key={event.id} deleteEvent={deleteEventAction} />
		));

	render() {
		const { userEvents, currentUserId, deleteEvent } = this.props;

		if (!userEvents) {
			return <Spinner />;
		}

		const ownEvents: IEventFormatClient[] = [];
		const subscribeEvents: IEventFormatClient[] = [];

		for (const eventVisitor of userEvents) {
			eventVisitor.event.userId === currentUserId
				? ownEvents.push(formatToClient(eventVisitor.event))
				: subscribeEvents.push(formatToClient(eventVisitor.event));
		}
		return (
			<div className="UserEvents">
				<UserEventsEditor saveEvent={this.props.saveEvent} id={currentUserId} />
				<div className="events-title">
					<span>Your Events</span>
				</div>
				<div className="event-list-container">
					{ownEvents.length === 0 ? (
						<div className="event-show-warning">
							No one event. You can craete
						</div>
					) : (
						this.renderEventList(ownEvents, deleteEvent)
					)}
				</div>
				<div className="events-title">
					<span>Events interested you</span>
				</div>
				<div className="event-list-container">
					{subscribeEvents.length === 0 ? (
						<div className="event-show-warning">No one event</div>
					) : (
						this.renderEventList(subscribeEvents, null)
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...props,
		currentUserId: state.profile.profileInfo.id,
		userEvents: state.events.userEvents
	};
};

const mapDispatchToProps = dispatch => {
	const actions = {
		getUserEvents,
		saveEvent,
		deleteEvent
	};

	return bindActionCreators(actions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserEvents);
