import React, { Component } from 'react'
import { action } from 'mobx'


export default class DataComponent extends Component {
  @action assignData(key, value) {
      this[key] = value;
  }
}
