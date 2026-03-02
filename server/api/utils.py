from django.contrib.auth.hashers import make_password,check_password

def hash_password(password):
    return make_password(password)

def compare_password(password,hashedpassword):
    return check_password(password,hashedpassword)


