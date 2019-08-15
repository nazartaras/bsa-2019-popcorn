import React, { PureComponent } from 'react';
import TimeAgo from 'react-time-ago';
import StoryViewerModal from '../StoryViewerModal/StoryViewerModal';
import StorySeenByModal from '../StorySeenByModal/StorySeenByModal';
import './StoryViewer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
	faEllipsisH,
	faEye,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import config from '../../../config';
import StoryVoting from '../../StoryVoting/StoryVoting';

interface IProps {
	stories: Array<{
		image_url: string;
		bckg_color: string;
		users: Array<{ name: string; image_url: string }>;
		userInfo: {
			userId: string;
			name: string;
			image_url: string;
		};
		created_at: Date;
		type: string;
		voting?: {
			backColor: string;
			backImage: string;
			deltaPositionHeadX: number;
			deltaPositionHeadY: number;
			deltaPositionOptionBlockX: number;
			deltaPositionOptionBlockY: number;
			header: string;
			id: string;
			options: Array<{
				body: string;
				voted: number;
			}>;
		};
		activity?: string;
	}>;
	currentUser: {
		userId: string;
	};
	currentStory: number;
	closeViewer: () => void;
}

interface IState {
	isModalShown: boolean;
	isSeenByModalShown: boolean;
	currentStory: number;
	translateValue: number;
}

class StoryViewer extends PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isModalShown: false,
			isSeenByModalShown: false,
			currentStory: props.currentStory,
			translateValue: -props.currentStory * 350
		};
	}

	isOwnStory(story) {
		return this.props.currentUser.userId === story.userInfo.userId;
	}

	toogleModal = () => {
		this.setState({ isModalShown: !this.state.isModalShown });
	};

	toogleSeenByModal = () => {
		this.setState({ isSeenByModalShown: !this.state.isSeenByModalShown });
	};

	isModalShown(story) {
		return this.state.isModalShown ? (
			<StoryViewerModal
				isOwn={this.isOwnStory(story)}
				closeModal={this.toogleModal}
			/>
		) : null;
	}

	isSeenByModalShown(story) {
		return this.state.isSeenByModalShown ? (
			<StorySeenByModal
				users={story.users}
				closeModal={this.toogleSeenByModal}
			/>
		) : null;
	}

	goToPrevStory = () => {
		if (this.state.currentStory === 0) return;
		this.setState(prevState => ({
			currentStory: prevState.currentStory - 1,
			translateValue: prevState.translateValue + 350
		}));
	};

	goToNextStory = () => {
		if (this.state.currentStory === this.props.stories.length - 1) return;
		this.setState(prevState => ({
			currentStory: prevState.currentStory + 1,
			translateValue: prevState.translateValue - 350
		}));
	};

	render() {
		const { stories } = this.props;

		return (
			<div className="story-viewer">
				<p className="left-arrow" onClick={this.goToPrevStory}>
					<FontAwesomeIcon icon={faChevronLeft} />
				</p>
				<div className="story-slider">
					<div
						className="slider-wrapper"
						style={{
							transform: `translateX(${this.state.translateValue}px)`,
							transition: 'transform ease-out 0.45s'
						}}
					>
						{stories.map((story, i) => (
							<div className="story" key={i}>
								<header>
									<img
										src={story.userInfo.image_url || config.DEFAULT_AVATAR}
										alt=""
									/>
									<span className="username">{story.userInfo.name}</span>
									<TimeAgo date={story.created_at} timeStyle="twitter" />
									<p className="ellipsis" onClick={this.toogleModal}>
										<FontAwesomeIcon icon={faEllipsisH} />
									</p>
								</header>

								{story.type === 'voting' && story.voting && (
									<StoryVoting
										header={story.voting.header}
										options={story.voting.options}
										deltaPositionForHeader={{
											x: story.voting.deltaPositionHeadX,
											y: story.voting.deltaPositionHeadY
										}}
										deltaPositionForOptionBlock={{
											x: story.voting.deltaPositionOptionBlockX,
											y: story.voting.deltaPositionOptionBlockY
										}}
										backColor={story.voting.backColor}
										userId={this.props.currentUser.userId}
										inEditor={false}
									/>
								)}
								{story.type === 'voting' ? null : (
									<main
										style={{
											backgroundImage: 'url(' + story.image_url + ')',
											backgroundColor: story.bckg_color
										}}
									>
										<div className={'seen'}>
											<p
												className={'seen-by-info'}
												onClick={this.toogleSeenByModal}
												style={{ width: '100%' }}
											>
												<span
													style={{
														display: 'flex',
														justifyContent: 'SPACE-BETWEEN',
														padding: '0 15px',
														width: '100%'
													}}
												>
													{this.isOwnStory(story) && (
														<span>
															<FontAwesomeIcon icon={faEye} />
															<span className="seen-by-amount">
																{story.users.length}
															</span>
														</span>
													)}
													{story.type && story.activity}
												</span>
											</p>
										</div>
									</main>
								)}
							</div>
						))}
					</div>
				</div>
				<div className="stories-right-icons">
					<p className="close-stories" onClick={this.props.closeViewer}>
						<FontAwesomeIcon icon={faTimes} />
					</p>
					<p className="right-arrow" onClick={this.goToNextStory}>
						<FontAwesomeIcon icon={faChevronRight} />
					</p>
				</div>
				{this.isModalShown(stories[this.state.currentStory])}
				{this.isSeenByModalShown(stories[this.state.currentStory])}
			</div>
		);
	}
}

export default StoryViewer;
