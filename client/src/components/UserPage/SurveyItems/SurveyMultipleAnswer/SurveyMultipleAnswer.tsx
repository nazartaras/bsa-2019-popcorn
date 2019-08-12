import React from 'react';
import './SurveyMultipleAnswer.scss';

interface IAnswer {
    questionId: string,
    optionId: string
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
    setAnswer?: (data : IAnswer) => void
};

const SurveySingleAnswer = (props: IProps) => {
    const { questionInfo } = props;
    const { id, title, options, required, image_link } = questionInfo;

    return (
        <div className="question-container single">
            <p className={`survey-question required-${required}`}>{title}</p>
            {   options!==undefined &&
                options.map((option, i) => (
                    <p key={i}>
                        <label>
                            <input 
                                type="radio" 
                                name={id} 
                                key={i} 
                                value={option.value} 
                                onChange={() => {
                                    if (!props.setAnswer) return;
                                    props.setAnswer({
                                        questionId: id,
                                        optionId: option.id
                                })}
                                }
                            /> 
                            <span className="checkmark"></span>
                            {option.value}
                        </label>
                    </p>
                ))
            }
            {
                image_link &&
                <img className="question-image" alt="" src={image_link} />
            }
        </div>
    )
};

export default SurveySingleAnswer;