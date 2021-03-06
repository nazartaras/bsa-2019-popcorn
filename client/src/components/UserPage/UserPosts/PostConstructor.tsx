import React from 'react';
import './PostConstructor.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageUploader from '../../MainPage/ImageUploader/ImageUploader';

import ChooseExtra from './PostExtra/choose-extra';
import Extra from '././PostExtra/extra';
import {
	faCheckCircle,
	faPlus,
	faTimes,
	faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

import { setPost } from '../actions';
import { fetchPosts } from '../../MainPage/FeedBlock/FeedBlock.redux/actions';
import { getUsersPosts } from '../../UserPage/actions';
import Cropper from 'react-cropper';
import { uploadFile } from '../../../services/file.service';
import MovieSearch from './MovieSearch';
import IReaction from '../../MainPage/Post/IReaction';
import IComment from '../../MainPage/Post/IComment';
import Image from '../../shared/Image/Image';
import config from '../../../config';

interface IPostConstructorProps {
	userId: string;
	setPost: (data: any) => any;
	getUsersPosts: (data: any) => any;
	fetchPosts: () => any;
	userName: string;
	userAvatar: string;
	croppedSaved: boolean;
	saveCropped: () => void;
	togglePostConstructor: (ev) => void;
	newPost?: INewPost | null;
}

export interface INewPost {
	id?: string;
	image_url: string;
	description: string;
	title: string;
	userId: string;
	extraLink: string;
	extraTitle: string;
	modalExtra: boolean;
	croppedSaved: boolean;
	reactions: IReaction[];
	comments: IComment[];
	extraData: any;
	extraType: string;
	movieSearchTitle: null | string;
	createdAt: string;
	top?: any;
	event?: any;
	survey?: any;
}

class PostConstructor extends React.Component<
	IPostConstructorProps,
	INewPost & { event?: any; top?: any; survey?: any }
> {
	static findMovie(str: string) {
		let find = str.match(/\$(.+)(.*?)(\s*?)/g);
		if (find && find[0]) {
			find = find[0].split(' ');
			if (find) {
				return find[0].slice(1);
			}
		}
		return '';
	}

	constructor(props: IPostConstructorProps) {
		super(props);

		let item = { title: '' };
		if (props.newPost) {
			item = props.newPost.top ||
				props.newPost.event ||
				props.newPost.survey || { title: '' };
		}
		this.state = {
			image_url: '',
			description: '',
			title: 'test title',
			userId: this.props.userId,
			extraLink: '',
			extraTitle: '',
			extraData: null,
			extraType: '',
			modalExtra: false,
			croppedSaved: false,
			reactions: [],
			comments: [],
			movieSearchTitle: null,
			createdAt: '',
			...(props.newPost
				? {
						...props.newPost,
						extraLink: props.newPost.extraLink,
						extraTitle: item.title,
						extraData: item,
						extraType:
							props.newPost.extraLink &&
							props.newPost.extraLink.split('/')[1].slice(0, -1)
				  }
				: {})
		};
		this.imageStateHandler = this.imageStateHandler.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveCropped = this.onSaveCropped.bind(this);
		this.setExtraData = this.setExtraData.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
	}

	private cropper = React.createRef<Cropper>();

	setExtraData(data) {
		data
			? this.setState({
					extraLink: data.link,
					extraTitle: data.data.title,
					extraData: data.data,
					extraType: data.type,
					image_url: this.getImageUrl(data),
					croppedSaved: false
			  })
			: this.setState({
					extraLink: '',
					extraTitle: '',
					extraData: {},
					extraType: '',
					image_url: '',
					croppedSaved: false
			  });
	}

	isExtraType(extraType: string) {
		return (
			extraType === 'survey' || extraType === 'event' || extraType === 'top'
		);
	}

	getImageUrl(data: any) {
		let imageUrl = '';

		switch (data.type) {
			case 'survey':
				imageUrl = data.data.image || config.DEFAULT_SURVEY_IMAGE;
				break;
			case 'event':
				imageUrl = data.data.image || config.DEFAULT_EVENT_IMAGE;
				break;
			case 'top':
				imageUrl = data.data.topImageUrl || config.DEFAULT_TOP_IMAGE;
				break;
			default:
				imageUrl = this.state.image_url;
				break;
		}

		return imageUrl;
	}

	toggleModal() {
		this.setState({
			modalExtra: !this.state.modalExtra
		});
	}

	imageStateHandler(data, croppedSaved?: boolean) {
		this.setState({
			image_url: data,
			croppedSaved: croppedSaved ? croppedSaved : this.state.croppedSaved
		});
	}

	onChangeData(value: string, keyword: string) {
		const title = PostConstructor.findMovie(value);
		this.setState({
			...this.state,
			[keyword]: value,
			movieSearchTitle: title || null
		});
	}

	onSave(ev) {
		if (this.state.description.trim() === '') return;
		const { extraType, extraData } = this.state;
		if (extraType === 'top') {
			this.setState({
				extraData: {
					id: extraData.id
				}
			});
			this.props.setPost({
				...this.state,
				extraData: {
					id: extraData.id
				}
			});
		} else {
			this.props.setPost(this.state);
		}
		this.setState({
			image_url: '',
			description: '',
			extraLink: '',
			extraTitle: '',
			croppedSaved: false
		});
		this.props.togglePostConstructor(ev);
	}

	onCancel() {
		this.setState({
			image_url: ''
		});
	}

	onSaveCropped() {
		if (this.cropper.current) {
			this.cropper.current.getCroppedCanvas().toBlob(
				blob => {
					const data = new FormData();
					data.append('file', blob);
					uploadFile(data)
						.then(({ imageUrl }) => {
							this.imageStateHandler(imageUrl, true);
						})
						.catch(error => {});
				},
				'image/jpeg',
				0.85
			);
		}
	}

	addMovieCaption(movie, movieSearchTitle) {
		const { description } = this.state;
		const caption = `@${movie.id}{${movie.title +
			' (' +
			movie.date.split('-')[0] +
			')'}}`;
		const newDescription = description.replace(`$${movieSearchTitle}`, caption);

		this.setState({
			description: newDescription,
			movieSearchTitle: null
		});
	}

	render() {
		const { movieSearchTitle } = this.state;
		const data =
			this.state.extraData ||
			this.state.event ||
			this.state.top ||
			this.state.survey ||
			{};

		return (
			<div className="post-constructor-modal">
				<div
					className="overlay"
					onClick={ev => this.props.togglePostConstructor(ev)}
				/>
				<div className="postconstr-wrp">
					<p
						className="close-modal"
						onClick={ev => this.props.togglePostConstructor(ev)}
					>
						<FontAwesomeIcon icon={faTimes} />
					</p>
					<div className="postconstr">
						{this.state.image_url && !this.state.croppedSaved && (
							<div>
								<Cropper
									ref={this.cropper}
									className="postconstr-img"
									src={this.state.image_url}
								/>
								<span onClick={this.onSaveCropped}>
									<FontAwesomeIcon
										icon={faCheckCircle}
										className="fontAwesomeIcon cropperSettingsIcon"
									/>
								</span>
								<span onClick={this.onCancel}>
									<FontAwesomeIcon
										icon={faTimesCircle}
										className={'fontAwesomeIcon cropperSettingsIcon'}
									/>
								</span>
							</div>
						)}
						{this.state.image_url &&
							this.state.croppedSaved &&
							!this.state.extraLink && (
								<div className="image-list-wrapper">
									<div className="post-img-wrapper">
										<img className="post-img" src={this.state.image_url} />
									</div>
									<div className="card-wrapper">
										<button className="button-image">
											<ImageUploader
												icon={faPlus}
												isIcon={true}
												imageHandler={uploadFile}
												imageStateHandler={this.imageStateHandler}
											/>
										</button>
									</div>
								</div>
							)}
						{this.state.extraLink && (
							<>
								{this.state.croppedSaved && (
									<Image
										src={this.state.image_url}
										defaultSrc={this.state.image_url}
										alt={'extra-poster'}
										className={'extra-poster'}
									/>
								)}

								<Extra
									link={this.state.extraLink}
									data={data}
									type={this.state.extraType}
									clearExtra={this.setExtraData}
								/>
							</>
						)}
						<textarea
							placeholder="Create new post..."
							value={this.state.description}
							onChange={e => this.onChangeData(e.target.value, 'description')}
						/>
						{movieSearchTitle && (
							<div style={{ width: '100%' }}>
								<MovieSearch
									inputData={movieSearchTitle}
									onSelectMovie={movie =>
										this.addMovieCaption(movie, movieSearchTitle)
									}
									elasticProperties={['id', 'title', 'release_date']}
								/>
							</div>
						)}

						<ChooseExtra
							imageStateHandler={this.imageStateHandler}
							toggleModal={this.toggleModal}
							setExtra={this.setExtraData}
						/>
					</div>
					<div className="save-wrp">
						<button className="save-btn" onClick={ev => this.onSave(ev)}>
							{this.props.newPost ? 'Edit Post' : 'Add Post'}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (rootState, props) => ({
	...props,
	userName: rootState.profile.profileInfo.name,
	userAvatar: rootState.profile.profileInfo.avatar
});

const actions = {
	setPost,
	getUsersPosts,
	fetchPosts
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PostConstructor);
