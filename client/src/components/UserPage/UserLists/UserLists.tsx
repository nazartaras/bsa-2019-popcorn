import React, { useState } from 'react';
import './UserLists.scss';
import MovieListCreator from './MovieListCreator/MovieListCreator';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	saveMovieList,
	fetchMovieListsPreview,
	deleteMovieList
} from './actions';
import Spinner from '../../shared/Spinner';
import MovieListPreviewItem from './MovieListPreviewItem/MovieListPreviewItem';

export interface INewMovieList {
	title: string;
	isPrivate: boolean;
	despription?: string;
	image_url?: string;
	moviesId: string[];
}

interface IProps {
	saveMovieList: (movieList: INewMovieList) => object;
	fetchMovieListsPreview: () => object;
	deleteMovieList: (movieListId: string) => object;
	movieListsPreview?: Array<any>;
	isLoading: boolean;
}

const UserLists: React.FC<IProps> = ({
	saveMovieList,
	fetchMovieListsPreview,
	movieListsPreview,
	deleteMovieList,
	isLoading
}) => {
	const [showCreator, setShowCreator] = useState(false);

	if (!movieListsPreview) {
		fetchMovieListsPreview();
		return <Spinner />;
	}

	if (isLoading) {
		return <Spinner />;
	}

	if (showCreator) {
		return (
			<MovieListCreator
				setShowCreator={setShowCreator}
				saveMovieList={saveMovieList}
			/>
		);
	}
	return (
		<div className="UserLists">
			<button
				className="create-movie-list-button"
				onClick={() => setShowCreator(true)}
			>
				Create movie list
			</button>
			<div className="movie-list-preview-container">
				{movieListsPreview.map(preview => (
					<MovieListPreviewItem
						key={preview.id}
						deleteMovieList={deleteMovieList}
						moviePreview={preview}
					/>
				))}
			</div>
		</div>
	);
};

const mapStateToProps = (rootState, props) => ({
	...props,
	movieListsPreview: rootState.movieList.movieListsPreview,
	isLoading: rootState.movieList.isLoading
});

const mapDispatchToProps = dispatch => {
	const actions = {
		saveMovieList,
		fetchMovieListsPreview,
		deleteMovieList
	};

	return bindActionCreators(actions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserLists);
