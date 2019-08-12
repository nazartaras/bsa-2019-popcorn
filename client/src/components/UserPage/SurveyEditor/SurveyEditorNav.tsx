import React, { useState } from 'react';
import SurveyEditorBody from './SurveyEditorBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Survey from '../Survey/Survey';
import './SurveyEditor.scss';

import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

interface ISurvey {
	id: string;
	created_at: Date;
	title: string;
	type: string;
	description: string;
	user_id: string;
	user: {
		name: string;
		image_link: string;
	};
	participants: number;
	questions: Array<{
		id: string;
		survey_id: string;
		title: string;
		firstLabel?: string;
		lastLabel?: string;
		type: string;
		image_link?: string;
		required: boolean;
		options?: Array<{
			id: string;
			question_id: string;
			value: string;
		}>;
		answers: Array<{
			id: string;
			question_id: string;
			option_id?: string;
			user_id: string;
			value: string;
		}>;
	}>;
}

interface IProps {
	mainPath: string;
	surveyInfo: ISurvey;
	updateInfo: (ISurvey) => void;
}

const SurveyEditorNav: React.FC<IProps> = (props: IProps) => {
	const { mainPath, surveyInfo } = props;

	const [survey, setSurvey] = useState({ ...surveyInfo });

	const updateInfo = newSurvey => {
		setSurvey(newSurvey);
	};

	return (
		<div className="survey-editor">
			<Switch>
				<Route
					exact
					path={`${mainPath}/questions`}
					render={() => (
						<SurveyEditorBody
							updateInfo={updateInfo}
							saveInfo={props.updateInfo}
							mainPath={mainPath}
							surveyInfo={survey}
						/>
					)}
				/>
				<Route
					exact
					path={`${mainPath}/responses/`}
					render={() => (
						<SurveyEditorBody
							updateInfo={updateInfo}
							mainPath={mainPath}
							surveyInfo={survey}
						/>
					)}
				/>
				<Route
					exact
					path={`${mainPath}/responses/statistics`}
					render={() => (
						<SurveyEditorBody
							updateInfo={updateInfo}
							mainPath={mainPath}
							surveyInfo={survey}
						/>
					)}
				/>
				<Route
					exact
					path={`${mainPath}/responses/individual`}
					render={() => (
						<SurveyEditorBody
							updateInfo={updateInfo}
							mainPath={mainPath}
							surveyInfo={survey}
						/>
					)}
				/>
				<Route
					exact
					path={`${mainPath}/preview`}
					render={() => (
						<div className="preview-container">
							<NavLink to={mainPath} className="preview-back">
								<FontAwesomeIcon icon={faArrowLeft} />
							</NavLink>
							<Survey surveyInfo={survey} />
						</div>
					)}
				/>
				<Redirect to={`${mainPath}/questions`} />
			</Switch>
		</div>
	);
};

export default SurveyEditorNav;