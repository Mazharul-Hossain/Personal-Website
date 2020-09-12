import {Component, OnInit, AfterViewInit} from '@angular/core';

import { AboutSkill } from './types';
import { aboutSkills } from './about-skills';

declare var jQuery: any;
declare var Waypoint: any;

import * as $ from 'jquery';
import 'jquery.appear';
import counterUp from 'counterup2';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:variable-name
  about_skills: AboutSkill[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.about_skills = aboutSkills;
  }

  ngAfterViewInit(): void{
    this.show_skills();
  }

  show_skills(): void {
    for (const skill of this.about_skills) {
      const id: string = skill.id;
      // ===== Progress Bar
      if ($('#progress-line-' + id).length){
        $('#progress-line-' + id).appear(function(): void {
          $(this).css('width', skill.performance + '%');
        }, {accY: 0});
      }
      // ===== Counter Up
      const el = document.getElementById('counter_' + id);
      if ( $('#counter_' + id).length ){
        // tslint:disable-next-line:no-unused-expression
        new Waypoint({
          element: el,
          // tslint:disable-next-line:typedef
          handler() {
            counterUp(el, {
              duration: 1600,
              delay: 32,
            } );
            this.destroy();
          },
          offset: 'bottom-in-view',
        });
      }
    }
  }
}
