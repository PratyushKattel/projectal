class CookieJWTAuthenticationMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access = request.COOKIES.get('access')

        if access:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access}'

        return self.get_response(request)