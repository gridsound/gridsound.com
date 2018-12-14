"use strict";

const userPage = {
	init() {
		DOM.mainResendEmailBtn.onclick = this._resendEmailBtnClick.bind( this );
		router.on( [ "u" ], path => {
			userPageUser.load( path[ 1 ] );
		} );
	},

	// private:
	_resendEmailBtnClick() {
		apiClient.resendConfirmationEmail().then( res => {
			console.log( "resendConfirmationEmail", res );
		} );
	},
};
