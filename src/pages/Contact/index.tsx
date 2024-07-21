import React, { useState } from 'react';
import './style.css';
import { ContactpageLd } from '../../ld';
import { ContactFormData } from '../../types';
import { Title } from 'react-head';
import { JsonLd } from 'react-schemaorg';
import { ContactPage } from 'schema-dts';
import { useForm } from 'react-hook-form';


export const Contact = () => {
  const [submissionError, setSubmissionError] = useState<Error|undefined>(undefined);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormData>();

  async function submit(data: ContactFormData) {
    let response:Response;
    try {
      response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify(data) // Convert form data to JSON string
      })
    } catch (error:any){
      setSubmissionError(error);
      return;
    }

    if (response.status>299 || response.status < 200){
      setSubmissionError(new Error(`${response.status} ${response.statusText}`));
      return;
    }
    setSubmissionError(undefined);
    setSubmissionSuccess(true);
  }

  const validationErrors = Object.values(errors);

  return (
    <>
      <Title>{ContactpageLd.name}</Title>
      <JsonLd<ContactPage>
        item={{
          '@context': 'https://schema.org',
          ...ContactpageLd
        }}
      />
      <h1>{ContactpageLd.name}</h1>
      <p>Leave me a message</p>

      <form className="form" onSubmit={handleSubmit(async (data) => await submit(data))}>
        <input disabled={submissionSuccess} placeholder="Name" className={errors.name && "errorField"} type="string" {...register('name')} />
        {errors.name && <span className="errorMessage">{errors.name?.message}</span>}

        <input
          disabled={submissionSuccess}
          placeholder="Email address *"
          className={errors.email && "errorField"}
          type="email"
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address'
            },
            maxLength: { value: 320, message: 'Email address too long' }
          })}
        />
        {errors.email && <span className="errorMessage">{errors.email?.message}</span>}

        <textarea
          disabled={submissionSuccess}
          placeholder="Message *"
          className={errors.message && "errorField"}
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {errors.message && <span className="errorMessage">{errors.message?.message}</span>}
        {!submissionSuccess && <>
          <input type="submit" value="Send" className={(submissionSuccess || !!validationErrors.length)?`submitButtonDisabled`:`submitButton`} disabled={submissionSuccess || !!validationErrors.length} />
          {submissionError && <>
            <span className="errorMessage">{submissionError.message}</span>
            <br/>
            <span className="errorMessage">Failed to send message</span>
          </>}
        
        </> 
        }
        
      </form>
      
        {submissionSuccess && <>
          <p className="successMessage">Message sent!</p>
        </>}
    </>
  );
};
