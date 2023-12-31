export default function validation(values, page) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z0-9.-]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{4,20}$/;
  // const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,16}$/



  if (page == "signUp") {
    if (!values.firstName.trim()) {
      error.firstName = "First Name required";
    }
    if (!values.lastName.trim()) {
      error.lastName = "Last Name required";
    }

    if (values.email.trim() === "") {
      error.email = "Email Required";
    } else if (!email_pattern.test(values.email)) {
      error.email = "Enter the correct format example@gmai.com";
    }

    if (!values.country_code) {
      error.country_code = "select country code";
    }
    if (!values.phoneNumber) {
      error.phoneNumber = "Enter Phone number";
    }
    else if((values.phoneNumber+"").length <10 ||(values.phoneNumber+"").length >10 ){
      error.phoneNumber = 'Phone Number should be 10 length long'
    }

    if (values.password.trim() === "") {
      error.password = "Password Required";
    } else if (!password_pattern.test(values.password)) {
      // error.password = "Password need a correct format";
      error.password = "should contain one lower case (a-z)One Upper case(A-Z) One number(0-9) ,length should be less than 20 character"
    }
    if (!values.confirmPassword.trim()) {
      error.confirmPassword = "Confirm Password Required";
    } else if (values.confirmPassword !== values.password) {
      error.confirmPassword = "Password didn't match";
    }
  }else if(page == 'login'){
    if (values.email.trim() == "") {
        error.email = "Email Required";
      } else if (!email_pattern.test(values.email)) {
        error.email = "Enter the correct format example@gmai.com";
      }
      if (values.password.trim() == "") {
        error.password = "Password Required";
      } else if (!password_pattern.test(values.password)) {
        error.password = "Password need a correct format";
      }
  }
  return error;
}
