import React, { useState } from "react";
import { backend_url } from "../App";
import "./CSS/LoginSignup.css";
import { useI18n } from "../utils/i18n";

const LoginSignup = () => {

  const { t } = useI18n();
  const [mode,setMode] = useState('login');
  const [formData,setFormData] = useState({username:"",email:"",password:""});

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
    }

  const login = async () => {
    let dataObj;
    await fetch(`${backend_url}/login`, {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});
      console.log(dataObj);
      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
      else
      {
        alert(dataObj.errors)
      }
  }

  const signup = async () => {
    let dataObj;
    await fetch(`${backend_url}/signup`, {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});

      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
      else
      {
        alert(dataObj.errors)
      }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{mode === 'login' ? t('account.login') : t('account.register')}</h1>
        <div className="loginsignup-fields">
          {mode==='signup' ? <input type="text" placeholder={t('account.username_placeholder')} name="username" value={formData.username} onChange={changeHandler}/> : <></>}
          <input type="email" placeholder={t('account.email_placeholder')} name="email" value={formData.email} onChange={changeHandler}/>
          <input type="password" placeholder={t('account.password_placeholder')} name="password" value={formData.password} onChange={changeHandler}/>
        </div>

        <button onClick={()=>{mode==='login'?login():signup()}}>{t('action.continue')}</button>

        {mode==='login' ?
        <p className="loginsignup-login">{t('account.create_account_prompt')} <span onClick={()=>{setMode('signup')}}>{t('account.click_here')}</span></p>
        :<p className="loginsignup-login">{t('account.already_have_account')} <span onClick={()=>{setMode('login')}}>{t('account.login_here')}</span></p>}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>{t('account.agree_terms_full')}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
