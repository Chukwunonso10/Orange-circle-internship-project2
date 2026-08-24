type SignupPayload = {
    buisnessName: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phoneNumber: string;
};
type LoginPayload = {
    email?: string;
    password: string;
    phoneNumber?: string;
};

export function validator(payload: SignupPayload) {
    
    if (!payload.buisnessName.trim()) {
        return "buisnessName is required!!"
    }
    else if(!payload.email.trim()) {
        return "email is required!!"
    }
    else if(!payload.password.trim()) {
        return "password is required!!"
    }
    else if(!payload.confirmPassword.trim()) {
        return "confirm password is required!!"
    }
    else if(!payload.name.trim()) {
        return "name is required!!"
    }
    else if(!payload.phoneNumber.trim()) {
        return "phone Number is required!!"
    } else {
        return null
    }

}
export function LoginValidator(payload: LoginPayload) {
    
    if(!payload.email && !payload.phoneNumber) {
        return "email or phone is required!!"
    }
    if(!payload.password){
        return "password is required"
    }
    if(payload.password.length < 8){
        return "password should should be 8 characters and above"
    }
    return null
  

}