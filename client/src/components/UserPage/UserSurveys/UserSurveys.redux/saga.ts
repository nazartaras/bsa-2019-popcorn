import { all, takeEvery, call, put } from '@redux-saga/core/effects';
import { FETCH_SURVEYS, SET_SURVEYS, ADD_SURVEY, UPDATE_SURVEY } from './actionTypes';
import webApi from '../../../../services/webApi.service';
import config from '../../../../config';

export function* fetchSurveys(action) {
  try {
		const data = yield call(webApi, {
			method: 'GET',
			endpoint: config.API_URL + '/api/surveys'
		});
		yield put({
			type: SET_SURVEYS,
			payload: {
				surveys: data
			}
		});
	} catch (e) {
		console.log('survey saga fetch surveys: ', e.message);
	}
}

function* watchFetch() {
	yield takeEvery(FETCH_SURVEYS, fetchSurveys);
}

export function* addSurvey(action) {
  try {
		const data = yield call(webApi, {
			method: 'POST',
      endpoint: config.API_URL + '/api/surveys',
      body: {
				...action.payload.data
			}
		});
    if (data) yield put({ type: FETCH_SURVEYS });
	} catch (e) {
		console.log('survey saga create survey: ', e.message);
	}
}

function* watchAdd() {
	yield takeEvery(ADD_SURVEY, addSurvey);
}

export function* updateSurvey(action) {
  console.log(action.payload);
  try {
		const data = yield call(webApi, {
			method: 'PUT',
      endpoint: config.API_URL + '/api/surveys/' + action.payload.id,
      body: {
				...action.payload.data
			}
		});
    if (data.ok) yield put({ type: FETCH_SURVEYS });
	} catch (e) {
		console.log('survey saga update survey: ', e.message);
	}
}

function* watchUpdate() {
	yield takeEvery(UPDATE_SURVEY, updateSurvey);
}

export default function* survey() {
	yield all([watchFetch(), watchAdd(), watchUpdate()]);
}
