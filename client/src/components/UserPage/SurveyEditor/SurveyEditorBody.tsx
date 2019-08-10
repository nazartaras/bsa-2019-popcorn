import React from 'react';
import SurveyEditor from './SurveyEditor';
import { NavLink, Route, Switch } from 'react-router-dom';
import  SurveyReplies from '../SurveyReplies/SurveyReplies';

interface ISurvey {
    id: string,
    created_at: Date,
    title: string,
    type: string,
    description: string,
    user_id: string,
    user: {
        name: string,
        image_link: string
    },
    participants: number,
    questions: Array<{
        id: string,
        survey_id: string,
        title: string,
        firstLabel?: string,
        lastLabel?: string,
        type: string,
        image_link?: string,
        required: boolean,
        options?: Array<{
            id: string,
            question_id: string,
            value: string
        }>,
        answers: Array<{
            id: string,
            question_id: string,
            option_id?: string,
            user_id: string,
            value: string
        }>
    }>
}

interface IProps {
    updateInfo: (ISurvey) => void,
    saveInfo?: (ISurvey) => void
    mainPath: string,
    surveyInfo : ISurvey
}

const SurveyEditorBody: React.FC<IProps> = (props: IProps) => {
    const { mainPath, surveyInfo, updateInfo } = props;

    return (
        <div>
            <header>
                <NavLink to='/user-page/surveys'>go back</NavLink>
                <NavLink to={mainPath}>QUESTIONS</NavLink>
                <NavLink to={`${mainPath}/responses`}>RESPONSES</NavLink>
            </header>
            <Switch>
                <Route exact path={mainPath} render={() => {
                    return (
                        <div>
                            {
                                props.saveInfo !== undefined &&
                                <SurveyEditor 
                                    updateInfo={updateInfo} 
                                    mainPath={mainPath} 
                                    surveyInfo={surveyInfo} 
                                    saveInfo={props.saveInfo}
                                />
                            }
                        </div>
                    );
                }} />
                <Route path={`${mainPath}/responses`} render={() => (
                    <SurveyReplies mainPath={`${mainPath}/responses`} surveyInfo={surveyInfo}/>
                )} />
            </Switch>
        </div>
    )
}

export default SurveyEditorBody;