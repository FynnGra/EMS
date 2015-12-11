/*
 * This file is auto-generated.  DO NOT MODIFY.
 * Original file: C:\\Users\\Tim\\Desktop\\EMS\\markerDetectionIonic\\platforms\\android\\src\\net\\trentgardner\\cordova\\androidwear\\WearMessageApi.aidl
 */
package net.trentgardner.cordova.androidwear;
public interface WearMessageApi extends android.os.IInterface
{
/** Local-side IPC implementation stub class. */
public static abstract class Stub extends android.os.Binder implements net.trentgardner.cordova.androidwear.WearMessageApi
{
private static final java.lang.String DESCRIPTOR = "net.trentgardner.cordova.androidwear.WearMessageApi";
/** Construct the stub at attach it to the interface. */
public Stub()
{
this.attachInterface(this, DESCRIPTOR);
}
/**
 * Cast an IBinder object into an net.trentgardner.cordova.androidwear.WearMessageApi interface,
 * generating a proxy if needed.
 */
public static net.trentgardner.cordova.androidwear.WearMessageApi asInterface(android.os.IBinder obj)
{
if ((obj==null)) {
return null;
}
android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
if (((iin!=null)&&(iin instanceof net.trentgardner.cordova.androidwear.WearMessageApi))) {
return ((net.trentgardner.cordova.androidwear.WearMessageApi)iin);
}
return new net.trentgardner.cordova.androidwear.WearMessageApi.Stub.Proxy(obj);
}
@Override public android.os.IBinder asBinder()
{
return this;
}
@Override public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException
{
switch (code)
{
case INTERFACE_TRANSACTION:
{
reply.writeString(DESCRIPTOR);
return true;
}
case TRANSACTION_sendData:
{
data.enforceInterface(DESCRIPTOR);
java.lang.String _arg0;
_arg0 = data.readString();
java.lang.String _arg1;
_arg1 = data.readString();
this.sendData(_arg0, _arg1);
reply.writeNoException();
return true;
}
case TRANSACTION_addListener:
{
data.enforceInterface(DESCRIPTOR);
net.trentgardner.cordova.androidwear.WearMessageListener _arg0;
_arg0 = net.trentgardner.cordova.androidwear.WearMessageListener.Stub.asInterface(data.readStrongBinder());
this.addListener(_arg0);
reply.writeNoException();
return true;
}
case TRANSACTION_removeListener:
{
data.enforceInterface(DESCRIPTOR);
net.trentgardner.cordova.androidwear.WearMessageListener _arg0;
_arg0 = net.trentgardner.cordova.androidwear.WearMessageListener.Stub.asInterface(data.readStrongBinder());
this.removeListener(_arg0);
reply.writeNoException();
return true;
}
}
return super.onTransact(code, data, reply, flags);
}
private static class Proxy implements net.trentgardner.cordova.androidwear.WearMessageApi
{
private android.os.IBinder mRemote;
Proxy(android.os.IBinder remote)
{
mRemote = remote;
}
@Override public android.os.IBinder asBinder()
{
return mRemote;
}
public java.lang.String getInterfaceDescriptor()
{
return DESCRIPTOR;
}
@Override public void sendData(java.lang.String connectionId, java.lang.String data) throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
try {
_data.writeInterfaceToken(DESCRIPTOR);
_data.writeString(connectionId);
_data.writeString(data);
mRemote.transact(Stub.TRANSACTION_sendData, _data, _reply, 0);
_reply.readException();
}
finally {
_reply.recycle();
_data.recycle();
}
}
@Override public void addListener(net.trentgardner.cordova.androidwear.WearMessageListener listener) throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
try {
_data.writeInterfaceToken(DESCRIPTOR);
_data.writeStrongBinder((((listener!=null))?(listener.asBinder()):(null)));
mRemote.transact(Stub.TRANSACTION_addListener, _data, _reply, 0);
_reply.readException();
}
finally {
_reply.recycle();
_data.recycle();
}
}
@Override public void removeListener(net.trentgardner.cordova.androidwear.WearMessageListener listener) throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
try {
_data.writeInterfaceToken(DESCRIPTOR);
_data.writeStrongBinder((((listener!=null))?(listener.asBinder()):(null)));
mRemote.transact(Stub.TRANSACTION_removeListener, _data, _reply, 0);
_reply.readException();
}
finally {
_reply.recycle();
_data.recycle();
}
}
}
static final int TRANSACTION_sendData = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
static final int TRANSACTION_addListener = (android.os.IBinder.FIRST_CALL_TRANSACTION + 1);
static final int TRANSACTION_removeListener = (android.os.IBinder.FIRST_CALL_TRANSACTION + 2);
}
public void sendData(java.lang.String connectionId, java.lang.String data) throws android.os.RemoteException;
public void addListener(net.trentgardner.cordova.androidwear.WearMessageListener listener) throws android.os.RemoteException;
public void removeListener(net.trentgardner.cordova.androidwear.WearMessageListener listener) throws android.os.RemoteException;
}
