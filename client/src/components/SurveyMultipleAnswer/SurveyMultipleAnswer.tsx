import React from 'react';
import './SurveyMultipleAnswer.scss';

interface IAnswer {
    questionId: string,
    optionId: string,
    value: boolean
};

interface IProps {
    questionInfo: {
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
            }>
    },
    setAnswer: (data: IAnswer) => void
};

const SurveyMultipleAnswer = (props: IProps) => {
    const { questionInfo } = props;
    const { id, title, options } = questionInfo;

    return (
        <div className="multiple question-container">
            <p className="survey-question">{title}</p>
            {   
                options !== undefined &&
                options.map((option, i) => (
                    <p key={i}>
                        <label>
                            <input 
                                type="checkbox" 
                                name={id}
                                key={i} 
                                value={option.value} 
                                onChange={(event) => {
                                    props.setAnswer({
                                        questionId: id,
                                        optionId: option.id,
                                        value: event.target.checked
                                    });
                                }}
                            /> 
                            <span className="checkmark"></span>
                            {option.value}
                        </label>
                    </p>
                ))
            }
        </div>
    )
};

export default SurveyMultipleAnswer;