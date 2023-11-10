import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { HiBackspace } from 'react-icons/hi';
import { MdSchool } from 'react-icons/md';
import { Navbar, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';


const Test = ({
    handleGetAssessment,
    handlePushGrade,
    handleNavigation
}) => {

    const { assessmentId } = useParams();
    const test = useSelector(state => state.test)
    let [duration, setDuration] = useState('')
    let [grade, setGrade] = useState('')
    let [attempt, handleAttempt] = useState('')
    let [start, setStart] = useState('')
    const myJwt = localStorage.getItem('accessToken')

    useEffect(() => {
        checkStudentAttempt()
    }, [])

    useEffect(() => {
        let timeOut;

        if (start) {
            if (duration < 1) {
                handleSubmit()
            } else if (duration > 0) {
                timeOut = setTimeout(() => {
                    setDuration((prev) => prev - 1)
                }, 1000)
            }
        }

        return () => {
            clearTimeout(timeOut)
        }

    }, [start, duration])

    const checkStudentAttempt = async () => {
        try {
            const response = await axios.get(`https://react-school-back-end.vercel.app/student/assessmentAttempt/${assessmentId}`, {
                // const response = await axios.get(`http://localhost:9090/student/assessmentAttempt/${assessmentId}`, {
                headers: {
                    'Authorization': `Bearer ${myJwt}`,
                }
            })

            const { assessmentAttempt } = response.data
            if (assessmentAttempt) {
                handleAttempt(false)
                handleGetAssessment(assessmentId)
                setDuration(assessmentAttempt.duration)
                if (assessmentAttempt.start) {
                    setStart(true)
                }
            } else if (!assessmentAttempt) {
                handleAttempt(true)
            }

        } catch (err) { console.error(err) }
    }

    const handleAnswer = (assessmentId, questionId, answer) => {
        setGrade([...grade, { assessmentId, questionId, answer }])
    }

    const handleStart = async () => {
        setStart(true)
        try {
            await axios.get(`https://react-school-back-end.vercel.app/student/startAttempt/${assessmentId}`, {
                // await axios.get(`http://localhost:9090/student/startAttempt/${assessmentId}`, {
                headers: {
                    'Authorization': `Bearer ${myJwt}`,
                }
            })
        }
        catch (err) { console.error(err) }
    }

    const handleSubmit = async () => {
        setStart(false)
        try {
            await axios.get(`https://react-school-back-end.vercel.app/student/finishAttempt/${assessmentId}`, {
                // axios.get(`http://localhost:9090/student/finishAttempt/${assessmentId}`, {
                headers: {
                    'Authorization': `Bearer ${myJwt}`,
                }
            })
        }
        catch (err) { console.error(err) }

        if (!Array.isArray(grade)) {
            let grade = []
            const { allQuestions } = test
            for (let i = 0; i < allQuestions.length; i++) {
                grade.push({ assessmentId: test._id, questionId: 0, answer: 0 })
            }
            handlePushGrade(grade)
        } else if (Array.isArray(grade)) {
            handlePushGrade(grade)
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        checkStudentAttempt();
    }


    return (<Container className="school-homepage" fluid>
        <Navbar bg="dark" className='justify-content-between'>
            <MdSchool className='school-logo' />
        </Navbar>


        <Row className='m-0 justify-content-start'>
            <Col lg={2} md={3} sm={4} xs={4} className='return-link'>
                <button onClick={() => handleNavigation(`/moduleDetails/${test.moduleId}`)} className='return-link' >
                    <HiBackspace /> <span>Module Data</span>
                </button>
            </Col>
        </Row>

        <Row className='d-flex justify-content-center m-1'>
            <Col lg={5} md={6} sm={7} xs={10} className='heading-col d-flex justify-content-center'>
                <h3 className='text-center'>Assessment</h3>
            </Col>
        </Row>

        {!attempt ?
            <Row className='justify-content-center mt-5 mx-0 me-0'>

                <Col lg={10} md={10} sm={10} xs={10} className='table-responsive table-col my-3 text-start'>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <td className='text-center'>Title: {test.assessmentTitle} </td>
                                <td className='text-center'>Duration: {duration} Secs </td>
                            </tr>

                            <tr>
                                {!start &&
                                    <td colSpan={2} className=' text-center'>
                                        <button className='syn-button' onClick={() => handleStart()
                                        }>Start</button>
                                    </td>}
                            </tr>
                        </tbody>
                    </Table>


                    {start &&
                        <Col>
                            {test.allQuestions.map((quest, i) => (
                                <Table bordered key={i}>
                                    <thead>
                                        <tr>
                                            <th>Question {i + 1}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <label name={quest._id} htmlFor={quest._id}> {quest.question}</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input onClick={() => handleAnswer(test._id, quest._id, 'A')} type='radio' className='m-1' name={quest._id} id={quest._id} />
                                                <label htmlFor={quest._id}>{quest.optionA}</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input onClick={() => handleAnswer(test._id, quest._id, 'B')} type='radio' className='m-1' name={quest._id} id={quest._id} />
                                                <label htmlFor={quest._id}>{quest.optionB}</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input onClick={() => handleAnswer(test._id, quest._id, 'C')} type='radio' className='m-1' name={quest._id} id={quest._id} />
                                                <label htmlFor={quest._id}>{quest.optionC}</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input onClick={() => handleAnswer(test._id, quest._id, 'D')} type='radio' className='m-1' name={quest._id} id={quest._id} />
                                                <label htmlFor={quest._id}>{quest.optionD}</label>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            ))}


                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <td className='text-center'><button className='syn-button' onClick={() => handleSubmit()}>Submit</button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>}

                </Col>
            </Row >

            :

            <Row className='justify-content-center'>
                <Col lg={7} md={5} sm={8} xs={10} className='table-col d-flex justify-content-center text-center table-responsive'>
                    <Table bordered>
                        <tbody>
                            <tr>
                                <td colSpan={2}>Assessment Attempted</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row >
        }

        <footer className="school-footer">
            <Container fluid>
                <Row>
                    <Col lg={12} className="text-center">
                        <p>&copy; 2023 GoldenGate Academy. All Rights Reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    </Container >

    )
}
export default Test;