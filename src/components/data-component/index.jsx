import React, { Component } from 'react'


export default class DataComponent extends Component {
  assignData(key, value) {
      this[key] = value;
  }
}
