import React from 'react';
import Moment from 'react-moment';
import Image from '../../shared/Image/Image';
import config from '../../../config';
import { ITop } from '../TopPage.service';

import './TopPageTop.scss';
import { NavLink } from 'react-router-dom';

interface ITopProps {
	top: ITop;
}

const TopPageTop: React.SFC<ITopProps> = ({ top }) => {
	return (
		<div className="top">
			<div className="top-poster-wrp">
				<Image
					key={top.id}
					src={top.topImageUrl}
					defaultSrc={config.DEFAULT_TOP_IMAGE}
					alt="top-image"
					className="top-poster"
				/>
			</div>
			<div className="top-info">
				<span className="top-title">{top.title}</span>
				<NavLink
					className="user-info-container"
					to={`/user-page/${top.user.id}`}
				>
					<div className="top-author">
						<Image
							key={top.user.id}
							src={top.user.avatar}
							defaultSrc={config.DEFAULT_AVATAR}
							alt="user-avatar"
							className="top-user-avatar"
						/>
						<span className="top-author-name">{top.user.name}</span>
					</div>
				</NavLink>
				<span className="top-created-at">
					<Moment format=" D MMM YYYY " local>
						{String(top.created_at)}
					</Moment>
				</span>
			</div>
		</div>
	);
};

export default TopPageTop;
