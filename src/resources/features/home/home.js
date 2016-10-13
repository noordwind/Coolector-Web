import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import UserService from 'resources/services/user-service';
import LocationService from 'resources/services/location-service';
import LoaderService from 'resources/services/loader-service';
import ToastService from 'resources/services/toast-service';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, UserService, LocationService, LoaderService, ToastService, EventAggregator)
export class Home {
    constructor(router, userService, location, loader, toast, eventAggregator) {
        this.router = router;
        this.userService = userService;
        this.location = location;
        this.loader = loader;
        this.toast = toast;
        this.eventAggregator = eventAggregator;
    }

    async attached(){
        var hasLocation = this.location.current !== null;
        if(hasLocation){
            await this.loadUser();
            return;
        }
        this.locationLoadedSubscription = await this.eventAggregator.subscribe('location:loaded', async response => {
            this.loader.hide();
            await this.toast.success("Location has been loaded.");
        });
        this.loader.display();
        await this.toast.info("Getting the current location...");
        await this.loadUser();
    }

    async loadUser(){
        this.user = await this.userService.getAccount();
    }

    detached(){
        if(this.locationLoadedSubscription === null)
            return;

        this.locationLoadedSubscription.dispose();
    }
}
