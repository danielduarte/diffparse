
- Error reporting: If there are parsing errors, the partial result is returned and the list of detected errors including line numbers
Given a filepath it returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to a JS object with the diff content parsed and easily accessible programmatically.
```js
      mode: 'new file mode 100644',
      chunks: [
        {
          header: '@@ -0,0 +1 @@',
          content: [
            '+/node_modules/'
          ]
        }
      ]
  ],
  errors: []

## Having issues?

Feel free to report any issues or feature request in [Github repo](https://github.com/danielduarte/diffparse/issues/new).