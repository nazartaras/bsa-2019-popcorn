import { all } from 'redux-saga/effects';
import headerSaga from '../components/MovieSeriesPage/Movie.redux/saga';
import profileSaga from '../components/UserPage/saga';
import storySaga from '../components/MainPage/StoryList/story.redux/saga';
import feedSaga from '../components/MainPage/FeedBlock/FeedBlock.redux/saga';
import eventsSaga from '../components/UserPage/UserEvents/saga';
import userTopsSaga from '../components/UserPage/UserTops/saga';
import adminPanelSaga from '../components/AdminPanelPage/AdminPanelPage.redux/saga';

export default function* rootSaga() {
	yield all([
		headerSaga(),
		profileSaga(),
		storySaga(),
		feedSaga(),
		eventsSaga(),
		userTopsSaga(),
		adminPanelSaga()
	]);
}
