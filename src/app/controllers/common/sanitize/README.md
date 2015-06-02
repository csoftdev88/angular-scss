# Saitize Controller
`SanitizeCtrl` provides functionality fom HTML sanitization of data recieved from the API. [See more](https://docs.angularjs.org/api/ngSanitize)

## Usage
### Scope inheritance
```
  $controller('SanitizeCtrl', {$scope: $scope});
```

### Template
```<p ng-bind-html="sanitize(details.description)"></p>```
