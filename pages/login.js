import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { autoLogin } from '../utils/auth';
import Link from 'next/link';
import Layout from '../components/Layout';
import baseURL from '../utils/baseURL';
import axios from 'axios';
import Spinner from '../components/Shared/Spinner';

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
});

const Login = () => {
  const [submit, setSubmit] = useState(false);

  return (
    <>
      <Layout>
        <div className="container">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={LoginSchema}
            onSubmit={async values => {
              try {
                setSubmit(true);
                const { data } = await axios.post(
                  `${baseURL}/api/login`,
                  values
                );
                setSubmit(false);
                autoLogin(data);
              } catch (error) {
                console.log(error);
              } finally {
                setSubmit(false);
              }
            }}
          >
            {({ errors, touched, handleChange, handleSubmit, values }) => (
              <form onSubmit={handleSubmit} className="auth-form">
                <h1 className="page-heading"> Login </h1>
                <div className="group">
                  <input
                    className={`input ${errors.email &&
                      touched.email &&
                      'input-error'}`}
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && touched.email ? (
                    <div className="error">{errors.email}</div>
                  ) : null}
                </div>

                <div className="group">
                  <input
                    className={`input ${errors.password &&
                      touched.password &&
                      'input-error'}`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {errors.password && touched.password ? (
                    <div className="error">{errors.password}</div>
                  ) : null}
                </div>
                <div className="group">
                  <button type="submit" className="btn" disabled={submit}>
                    {submit ? (
                      <Spinner width={40} height={40} color="#fff" />
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
                <span className="link">
                  Don't have an account?{' '}
                  <Link href="/signup">
                    <a className="link link-text"> Create an account.</a>
                  </Link>
                </span>
              </form>
            )}
          </Formik>
        </div>
      </Layout>
      <style jsx>
        {`
          .container {
            max-width: 1200px;
            margin: 2rem auto;
          }

          .page-heading {
            font-size: 3rem;
            text-transform: uppercase;
          }

          .auth-form {
            padding: 2rem 0;
            width: 50rem;
            margin: 0 auto;
          }

          .auth-form .input {
            width: 100%;
            height: 5rem;
            font-size: 1.7rem;
            border: 1px solid transparent;
            border-bottom: 1px solid #666;
          }

          .auth-form .input:focus {
             outline: none;
          }

          .group {
            margin-top: 2.5rem;
          }

          .auth-form .btn {
            width: 100%;
            height 6rem;
            background-color: var(--color-dark);
            color: #fff;
            font-size: 2rem;
            font-family: inherit;
            border: 1px solid var(--color-dark);
            cursor: pointer;
          }

          .link {
            margin-top: 1rem;
            color: var(--color-dark);
            display: inline-block;
            font-size: 1.7rem;
          }

          .link-text {
            color: var(--color-primary);
          }

          .error {
            color: red;
            font-size: 1.6rem;
            padding: 0.2rem 0;
          }

          .auth-form .input-error {
            border-bottom: 1px solid red;
          }
        `}
      </style>
    </>
  );
};

export default Login;
