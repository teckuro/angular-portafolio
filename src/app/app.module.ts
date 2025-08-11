import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DotaService } from './services/dota/dota.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [AppComponent, InicioComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule],
	providers: [DotaService],
	bootstrap: [AppComponent]
})
export class AppModule {}
