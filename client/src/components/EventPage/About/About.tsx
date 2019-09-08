import React, { useState } from 'react';
import Modal from 'react-responsive-modal';
import Moment from 'react-moment';
import './About.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faClock,
	faMapMarker,
	faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { IEventFormatClient } from '../../UserPage/UserEvents/UserEvents.service';
import MapComponent from '../../UserPage/UserEvents/EventMap/Map';

interface IProps {
	event: IEventFormatClient;
}

const About: React.SFC<IProps> = ({ event }) => {
	const [locationMap, setLocationMap] = useState(false);

	return (
		<div className="about-event">
			<div className="date">
				<FontAwesomeIcon className="icon" icon={faClock} />
				<span>
					{
						<Moment format=" D MMM HH:mm " local={true}>
							{String(event.dateRange.startDate)}
						</Moment>
					}{' '}
					-
					{
						<Moment format=" D MMM HH:mm " local={true}>
							{String(event.dateRange.endDate)}
						</Moment>
					}
				</span>
			</div>
			<div className="location">
				<div className="location-info">
					<div>
						<FontAwesomeIcon className="icon" icon={faMapMarker} />
						<span>
							{event.location.lat} {event.location.lng}
						</span>
					</div>
					<span
						className="location-btn"
						onClick={() => setLocationMap(prevLocationMap => !prevLocationMap)}
					>
						Show map
					</span>
				</div>
				<Modal
					open={locationMap}
					onClose={() => setLocationMap(prevLocationMap => !prevLocationMap)}
					showCloseIcon={false}
					focusTrapped={false}
					center
					classNames={{
						modal: 'modal-window'
					}}
				>
					<MapComponent currentLocation={event.location} />
					{/* <EventMap
						googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}`}
						loadingElement={<div className="map-loading-elem" />}
						containerElement={<div className="map-container" />}
						mapElement={<div className="map-elem" />}
					/> */}
					<button
						className="modal-btn-close"
						onClick={() => setLocationMap(prevLocationMap => !prevLocationMap)}
					>
						Close
					</button>
				</Modal>
			</div>
			<div className="details">
				<FontAwesomeIcon className="icon" icon={faInfoCircle} />
				<span>{event.description}</span>
			</div>
		</div>
	);
};

export default About;
