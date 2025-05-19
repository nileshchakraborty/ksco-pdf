package ksco.software.SPDF.config.interfaces;

import java.sql.SQLException;
import java.util.List;

import ksco.software.SPDF.model.exception.UnsupportedProviderException;
import ksco.software.SPDF.utils.FileInfo;

public interface DatabaseInterface {
    void exportDatabase() throws SQLException, UnsupportedProviderException;

    void importDatabase();

    boolean hasBackup();

    List<FileInfo> getBackupList();
}
