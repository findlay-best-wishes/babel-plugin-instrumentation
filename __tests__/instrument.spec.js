// import instrumentationPlugin from '../src/plugins/instrumentation'
// import { transformSync} from '@babel/core'
const instrumentationPlugin = require('../src/plugins/instrumentation')
const { transformSync} = require('@babel/core')

const code = `
  import aa from 'aa';
  import * as bb from 'bb';
  import {cc} from 'cc';
  import 'dd';

  function a () {
      console.log('aaa');
  }

  class B {
      bb() {
          return 'bbb';
      }
  }

  const c = () => 'ccc';

  const d = function () {
      console.log('ddd');
  }
`

const res = transformSync(code, {
  sourceType: 'unambiguous',
  plugins: [[instrumentationPlugin]]
})

console.log(res.code)