import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import IconComponent from './Icon';
import './IndexButtonBar.less';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {dictIcons, buttons} params
 */
class IndexButtonBar extends Component {
  render() {
    return (
      <div className='index-button-bar'>
        {
          this.props.buttons.map(
            item => (
              <div className='index-button-bar__thumbnail-button' key={item.name}>
                <div className='h3-typo index-button-bar__thumbnail-title'>{item.name}</div>
                <div className='index-button-bar__icon'>
                  <IconComponent
                    dictIcons={this.props.dictIcons}
                    iconName={item.icon}
                    height='90px'
                  />
                </div>
                <div className='body-typo index-button-bar__thumbnail-text'>{item.body}</div>
                {
                  item.link.startsWith('http') ?
                    <a className='index-button-bar__item' href={item.link}>
                      <Button
                        onClick={() => this.props.onActiveTab(item.link)}
                        label={item.label}
                        buttonType='primary'
                      />
                    </a> :
                    <Link className='index-button-bar__item' to={item.link}>
                      <Button
                        onClick={() => this.props.onActiveTab(item.link)}
                        label={item.label}
                        buttonType='primary'
                      />
                    </Link>
                }
              </div>
            ),
          )
        }
      </div>
    );
  }
}

IndexButtonBar.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired,
  onActiveTab: PropTypes.func,
};

IndexButtonBar.defaultProps = {
  onActiveTab: () => {},
};

export default IndexButtonBar;
